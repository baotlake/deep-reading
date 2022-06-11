
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


// May 18 2022 - delete history db
async function TEMP_migrate() {

    if (indexedDB.databases) {
        const databases = await indexedDB.databases()

        const historyDB = databases.find(db => db.name === 'history')
        if (historyDB) indexedDB.deleteDatabase('history')

        return
    }

    // firefox compatible
    indexedDB.deleteDatabase('history')

}