import { init } from './historyDB'

const data = {
    name: 'deep-reading',
    version: 1,
    openPromise: null as null | Promise<IDBDatabase>
}

async function handleUpgradeNeeded(e: IDBVersionChangeEvent) {
    const database: IDBDatabase = (e.target as IDBRequest).result
    if (e.oldVersion < 1) {
        database.createObjectStore('words', {
            keyPath: 'word'
        })
        database.createObjectStore('read-history', {
            autoIncrement: true,
        })
        database.createObjectStore('setting', {
            keyPath: 'key',
        })
    }
}


export async function open() {
    const { name, version, openPromise } = data
    if (openPromise) return openPromise

    const request = indexedDB.open(name, version)
    request.onupgradeneeded = handleUpgradeNeeded
    data.openPromise = new Promise<IDBDatabase>((resolve) => {
        request.onsuccess = () => {
            const database = request.result
            database.onerror = console.error
            resolve(database)
        }
    })

    TEMP_migrate()

    return data.openPromise
}


// history -> deep-reading
async function TEMP_migrate() {
    const oldDB = await init()
    const oldTransaction = oldDB.transaction('reading', 'readwrite')
    const oldObjectStore = oldTransaction.objectStore('reading')
    const oldRequest = oldObjectStore.openCursor(null, 'next')

    const db = await open()

    oldRequest.onsuccess = (e) => {
        const cursor = oldRequest.result
        if (cursor) {
            console.log('migrate -->> ', cursor.key)
            const data = cursor.value

            const transaction = db.transaction('read-history', 'readwrite')
            const objectStore = transaction.objectStore('read-history')
            objectStore.add(data)
            oldObjectStore.delete(cursor.key)
            cursor.continue()
        }
    }
}