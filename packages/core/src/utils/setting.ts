import { open } from '../db'


const STORE_NAME = 'setting'

async function getStore(mode: IDBTransactionMode = 'readonly') {
    const db = await open()
    const transaction = db.transaction(STORE_NAME, mode)
    const objectStore = transaction.objectStore(STORE_NAME)

    return objectStore
}

export async function getSetting<T = unknown>(key: string): Promise<T> {
    const objectStore = await getStore()
    const request = objectStore.get(key)

    const data = await new Promise<any>((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result)
        }
        request.onerror = () => {
            resolve({})
            // reject()
        }
    })
    return data
}

export async function setSetting<T = Record<string, any>>(value: { key: string } & T) {
    const objectStore = await getStore('readwrite')
    objectStore.put(value)
}