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
    update(item: Partial<ReadingHistoryItem>): Promise<void>
    get(limit: number): Promise<Partial<ReadingHistoryItem>[]>
}

export default class ReadingHistory implements ReadingHistoryInterface {
    private db: IDBDatabase
    private objectStore: IDBObjectStore
    private key: number

    private initPromise: Promise<void>

    constructor() {
        this.initPromise = this.init()
    }

    private async init() {
        let request = indexedDB.open('history', 1)
        request.onupgradeneeded = (e) => {
            let db = (e.target as IDBRequest).result
            let objStore = db.createObjectStore('reading', {
                autoIncrement: true,
            })
        }
        this.db = await new Promise<IDBDatabase>((resolve) => {
            request.onsuccess = (e) => {
                let db = (e.target as IDBRequest).result
                db.onerror = console.error
                resolve(db)
            }
        })
    }

    public async push(item: Partial<ReadingHistoryItem>) {
        if (!item.href) return

        await this.initPromise
        let transaction = this.db.transaction('reading', 'readwrite')
        let objectStore = transaction.objectStore('reading')
        this.key = await new Promise((resolve) => {
            objectStore.add({
                ...item,
            }).onsuccess = (e) => {
                resolve((e.target as IDBRequest<number>).result)
            }
        })
    }

    public async update(item: Partial<ReadingHistoryItem>) {
        await this.initPromise
        let transaction = this.db.transaction('reading', 'readwrite')
        let objectStore = transaction.objectStore('reading')
        let itemData: ReadingHistoryItem = await new Promise((resolve) => {
            objectStore.get(this.key).onsuccess = (e) => {
                resolve((e.target as IDBRequest).result)
            }
        })

        objectStore.put(
            {
                ...itemData,
                ...item,
            },
            this.key
        ).onsuccess = (e) => {
            console.log('update success', e)
        }
    }

    public async get(limit: number) {
        await this.initPromise
        let transaction = this.db.transaction('reading', 'readonly')
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
}
