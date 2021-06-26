let dbPromise: Promise<IDBDatabase>

let name = 'history'
let version = 3

function handleUpgradeNeeded(e: IDBVersionChangeEvent) {
    let database = (e.target as IDBRequest).result
    console.log('handleUpgradeNeeded', e)

    if (e.oldVersion < 1) {
        database.createObjectStore('reading', {
            autoIncrement: true,
        })
    }

    if (e.oldVersion < 2) {
        database.createObjectStore('words', {
            keyPath: 'word',
        })
    }

    if (e.oldVersion < 3) {
        database.createObjectStore('doc', {
            keyPath: 'url',
        })
    }
}

export async function init() {
    if (dbPromise) return dbPromise
    let request = indexedDB.open(name, version)
    request.onupgradeneeded = handleUpgradeNeeded

    dbPromise = new Promise<IDBDatabase>((resolve) => {
        request.onsuccess = (e) => {
            let database = (e.target as IDBRequest).result
            database.onerror = console.error
            resolve(database)
        }
    })

    return dbPromise
}
