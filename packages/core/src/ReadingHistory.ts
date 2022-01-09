import { init } from './db/historyDB'

export interface ReadingHistoryItem {
    href: string
    title: string
    icon: string
    description: string
    scrollXY: [number, number]
    createdAt: number
    updatedAt: number
    time: number
}

interface ReadingHistoryInterface {
    push(item: Partial<ReadingHistoryItem>): Promise<void>

    get(limit: number): Promise<Partial<ReadingHistoryItem>[]>
}

export default class ReadingHistory implements ReadingHistoryInterface {
    private db: IDBDatabase | undefined
    private objectStore: IDBObjectStore | undefined
    private key: number | undefined
    private data: Partial<ReadingHistoryItem>

    // private readonly initPromise: Promise<void>

    constructor() {
        this.data = {}
    }

    private async init() {
        const db = await init()
        let transaction = db.transaction('reading', 'readonly')
        let objectStore = transaction.objectStore('reading')
        objectStore.openCursor(null, 'prev').onsuccess = (e) => {
            let cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
            if (cursor) {
                this.data = cursor.value
                this.key = cursor.key as number
            }
        }

        this.TEMP_migrateData()
        this.db = db
        return db
    }

    public async push(item: Partial<ReadingHistoryItem>) {
        if (!item.href) return
        !this.db && await this.init()

        if (this.data && this.isSamePage(this.data?.href || '', item.href)) {
            return this.update(item)
        }
        return this.create(item)
    }

    public async get(limit: number) {
        const db = this.db || await this.init()
        let transaction = db.transaction('reading', 'readonly')
        let objectStore = transaction.objectStore('reading')
        let itemList = await new Promise<Partial<ReadingHistoryItem>[]>((resolve) => {
            let list: Partial<ReadingHistoryItem>[] = []
            objectStore.openCursor(null, 'prev').onsuccess = (e) => {
                let cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
                if (cursor) {
                    list.push(cursor.value)
                    if (list.length >= limit) return resolve(list)
                    cursor.continue()
                } else {
                    resolve(list)
                }
            }
        })
        return itemList
    }

    private isSamePage(url1: string, url2: string) {
        if (!url1 || !url2) return false
        const urlPattern = /^https?:\/\/\w+/
        if (urlPattern.test(url1) && urlPattern.test(url2)) {
            const urlObj1 = new URL(url1)
            const urlObj2 = new URL(url2)
            if (urlObj1.origin === urlObj2.origin && urlObj1.pathname === urlObj2.pathname) {
                return true
            }
            return false
        }
        return url1 === url2
    }

    private async create(item: Partial<ReadingHistoryItem>) {
        const db = this.db || await this.init()
        let transaction = db.transaction('reading', 'readwrite')
        let objectStore = transaction.objectStore('reading')
        this.key = await new Promise((resolve) => {
            objectStore.add({
                ...item,
            }).onsuccess = (e) => {
                this.data = { ...item }
                resolve((e.target as IDBRequest<number>).result)
            }
        })
    }

    private async update(item: Partial<ReadingHistoryItem>) {
        const db = this.db || await this.init()
        if (!this.key) return this.create(item)
        let transaction = db.transaction('reading', 'readwrite')
        let objectStore = transaction.objectStore('reading')
        let itemData: ReadingHistoryItem = await new Promise((resolve) => {
            objectStore.get(this.key as number).onsuccess = (e) => {
                resolve((e.target as IDBRequest).result)
            }
        })
        let data = {
            ...itemData,
            ...item,
        }
        objectStore.put(
            data,
            this.key
        ).onsuccess = (e) => {
            this.data = data
            console.log('update success', e)
        }
    }

    // migrate old data from wrp.netlify.app
    private async TEMP_migrateData() {
        let oldDataList: {
            url: string,
            icon: string,
            title: string,
            des: string
        }[] = []
        try {
            let readHistory = localStorage.getItem('read_history')
            if (readHistory) {
                oldDataList = JSON.parse(readHistory)
            }
        } catch (e) {
        }

        if (Array.isArray(oldDataList)) {

            for (let oldItem of oldDataList) {
                await this.push({
                    href: oldItem.url,
                    title: oldItem.title,
                    icon: oldItem.icon,
                    description: oldItem.des,
                    scrollXY: [0, 0],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    time: 0,
                })
            }
            localStorage.removeItem('read_history')
        }
    }
}
