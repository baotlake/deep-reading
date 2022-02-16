let initPromise: Promise<IDBDatabase>

const name = 'setting'
const version = 1

function handleUpgradeNeeded(e: IDBVersionChangeEvent) {
    console.log('handleUpgradeNeeded', e)

    const database = (e.target as IDBRequest).result
    if (e.oldVersion < 1) {
        database.createObjectStore('location', {
            keyPath: 'origin'
        })
    }
}

export async function init() {
    if (initPromise) return initPromise
    const request = indexedDB.open(name, version)
    request.onupgradeneeded = handleUpgradeNeeded

    initPromise = new Promise<IDBDatabase>((resolve) => {
        request.onsuccess = (e) => {
            const database = (e.target as IDBRequest).result
            database.onerror = console.error
            resolve(database)
        }
    })
}

export async function get<T>(key: string) {
    const db = await init()
    const transaction = db.transaction("setting", "readonly")
    const objectStore = transaction.objectStore("setting")
    return await new Promise<T | undefined>((resolve) => {
        const request = objectStore.get(key)
        request.onsuccess = () => {
            resolve(request.result)
        }
    })
}