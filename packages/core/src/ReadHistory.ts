import { open } from './db'

export interface ReadHistoryItem {
    href: string
    title: string
    icon: string
    description: string
    scrollXY: [number, number]
    createdAt: number
    updatedAt: number
    time: number
}

interface ReadHistoryInterface {
    push(item: Partial<ReadHistoryItem>): Promise<void>

    get(limit: number): Promise<Partial<ReadHistoryItem>[]>
}

const STORE_NAME = 'read-history'

export class ReadHistory implements ReadHistoryInterface {
    private db: IDBDatabase | undefined
    private key: number | undefined
    private data: Partial<ReadHistoryItem>


    constructor() {
        this.data = {}
    }

    private async openDB() {
        const db = await open()
        let transaction = db.transaction(STORE_NAME, 'readonly')
        let objectStore = transaction.objectStore(STORE_NAME)
        objectStore.openCursor(null, 'prev').onsuccess = (e) => {
            let cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
            if (cursor) {
                this.data = cursor.value
                this.key = cursor.key as number
            }
        }

        this.db = db
        return db
    }

    private async getStore(mode: IDBTransactionMode = 'readonly') {
        const db = this.db || await this.openDB()
        let transaction = db.transaction(STORE_NAME, mode)
        let objectStore = transaction.objectStore(STORE_NAME)
        return objectStore
    }

    public async push(item: Partial<ReadHistoryItem>) {
        if (!item.href) return
        !this.db && await this.openDB()

        if (this.data && this.isSamePage(this.data?.href || '', item.href)) {
            return this.update(item)
        }
        return this.create(item)
    }

    public async get(limit: number) {
        let objectStore = await this.getStore()
        let itemList = await new Promise<Partial<ReadHistoryItem>[]>((resolve) => {
            let list: Partial<ReadHistoryItem>[] = []
            objectStore.openCursor(null, 'prev').onsuccess = (e) => {
                let cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
                if (cursor) {
                    list.push({ ...cursor.value, key: cursor.key })
                    if (list.length >= limit) return resolve(list)
                    cursor.continue()
                } else {
                    resolve(list)
                }
            }
        })
        return itemList
    }

    public async delete(key: number) {
        const objectStore = await this.getStore('readwrite')
        objectStore.delete(key)
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

    private async create(item: Partial<ReadHistoryItem>) {
        let objectStore = await this.getStore('readwrite')
        this.key = await new Promise((resolve) => {
            objectStore.add({
                ...item,
            }).onsuccess = (e) => {
                this.data = { ...item }
                resolve((e.target as IDBRequest<number>).result)
            }
        })
    }

    private async update(item: Partial<ReadHistoryItem>) {
        let objectStore = await this.getStore('readwrite')
        if (!this.key) return this.create(item)
        let itemData: ReadHistoryItem = await new Promise((resolve) => {
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
}
