import { open } from './db'

export interface ReadHistoryItem {
    href: string
    title: string
    icon: string
    description: string
    scrollY: number
    createdAt: number
    updatedAt: number
    time: number
}

interface ReadHistoryItemWithKey extends Partial<ReadHistoryItem> {
    key: number
}

interface ReadHistoryInterface {
    push(item: Partial<ReadHistoryItem>): Promise<ReadHistoryItemWithKey | null>
    get(limit: number): Promise<Partial<ReadHistoryItem>[]>
}

const STORE_NAME = 'read-history'

export class ReadHistory implements ReadHistoryInterface {
    private db: IDBDatabase | undefined

    constructor() {
    }

    private async init() {
        const db = await open()
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
        if (!item.href) return null
        !this.db && await this.init()

        const recent = await this.getRecent()
        const last = recent.find((i) => this.isSamePage(i.href, item.href))

        if (last && last.key) {
            this.delete(last.key)
        }

        return this.create({ ...last, ...item })
    }

    public async update(key: number, item: Partial<ReadHistoryItem>) {
        if (typeof key !== 'number') {
            console.error('"key" argument is not valid')
            return null
        }
        const objectStore = await this.getStore('readwrite')
        const itemData: ReadHistoryItem = await new Promise((resolve) => {
            const request = objectStore.get(key)
            request.onsuccess = () => {
                resolve(request.result)
            }
        })
        const data = {
            ...itemData,
            ...item,
        }
        return new Promise<ReadHistoryItemWithKey | null>((resolve) => {
            const request = objectStore.put(
                data,
                key
            )
            request.onsuccess = (e) => {
                resolve({
                    ...data,
                    key: request.result as number,
                })
            }
            request.onerror = () => {
                resolve(null)
            }
        })
    }

    public async getRecent(length = 20) {
        const store = await this.getStore()
        const recentList: Partial<ReadHistoryItemWithKey>[] = []

        await new Promise<void>((resolve) => {
            const request = store.openCursor(null, 'prev')
            request.onsuccess = () => {
                const cursor = request.result
                if (cursor) {
                    const data = { ...cursor.value, key: cursor.key }
                    recentList.push(data)
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

    public async get(limit: number): Promise<ReadHistoryItemWithKey[]> {
        const objectStore = await this.getStore()
        const list: ReadHistoryItemWithKey[] = []

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
        return await new Promise<ReadHistoryItemWithKey | null>((resolve) => {
            const request = objectStore.add({
                ...item,
            })
            request.onsuccess = (e) => {
                resolve({
                    ...item,
                    key: request.result as number,
                })
            }
            request.onerror = () => {
                resolve(null)
            }
        })
    }
}
