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

    private async init() {
        const db = await open()
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const objectStore = transaction.objectStore(STORE_NAME)

        const request = objectStore.openCursor(undefined, 'prev')

        await new Promise<void>((resolve) => {
            request.onsuccess = (e) => {
                const cursor = request.result
                if (cursor) {
                    this.data = cursor.value
                    this.key = cursor.key as number
                }
                resolve()
            }
        })

        this.db = db
        return db
    }

    private async getStore(mode: IDBTransactionMode = 'readonly') {
        const db = this.db || await this.init()
        const transaction = db.transaction(STORE_NAME, mode)
        const objectStore = transaction.objectStore(STORE_NAME)
        return objectStore
    }

    public async push(item: Partial<ReadHistoryItem>) {
        if (!item.href) return
        !this.db && await this.init()

        if (this.isSamePage(this.data.href, item.href)) {
            return this.update(item)
        }
        return this.create(item)
    }

    public async getRecent(length = 20) {
        const store = await this.getStore()
        const recentList: Partial<ReadHistoryItem>[] = []

        await new Promise<void>((resolve) => {
            const request = store.openCursor(null, 'prev')
            request.onsuccess = () => {
                const cursor = request.result
                if (cursor) {
                    const data = { ...cursor.value, key: cursor.key }
                    const i = recentList.findIndex((item) => item.href === data.href)
                    if (i == -1) {
                        recentList.push(data)
                    }
                    if (recentList.length >= length) {
                        return resolve()
                    }
                    cursor.continue()
                } else {
                    resolve()
                }
            }
            request.onerror = () => {
                resolve()
            }
        })

        return recentList
    }

    public async get(limit: number) {
        const objectStore = await this.getStore()
        const list: Partial<ReadHistoryItem>[] = []

        await new Promise<void>((resolve) => {
            const request = objectStore.openCursor(null, 'prev')
            request.onsuccess = (e) => {
                const cursor = request.result
                if (cursor) {
                    list.push({ ...cursor.value, key: cursor.key })
                    if (list.length >= limit) return resolve()
                    cursor.continue()
                } else {
                    resolve()
                }
            }
            request.onerror = () => {
                resolve()
            }
        })
        return list
    }

    public async delete(key: number) {
        const objectStore = await this.getStore('readwrite')
        objectStore.delete(key)
    }

    private isSamePage(url1?: string, url2?: string) {
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
        const objectStore = await this.getStore('readwrite')
        this.key = await new Promise<number>((resolve) => {
            const request = objectStore.add({
                ...item,
            })
            request.onsuccess = (e) => {
                this.data = { ...item }
                resolve(request.result as number)
            }
        })
    }

    private async update(item: Partial<ReadHistoryItem>) {
        const objectStore = await this.getStore('readwrite')
        if (!this.key) return this.create(item)
        const itemData: ReadHistoryItem = await new Promise((resolve) => {
            const request = objectStore.get(this.key as number)
            request.onsuccess = () => {
                resolve(request.result)
            }
        })
        const data = {
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
