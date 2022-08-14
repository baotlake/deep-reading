import { open } from '../db'


const STORE_NAME = 'setting'

async function getStore(mode: IDBTransactionMode = 'readonly') {
    const db = await open()
    const transaction = db.transaction(STORE_NAME, mode)
    const objectStore = transaction.objectStore(STORE_NAME)

    return objectStore
}

export async function getSetting<T = unknown>(key: string): Promise<T | undefined> {
    const objectStore = await getStore()
    const request = objectStore.get(key)

    const data = await new Promise<T | undefined>((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result)
        }
        request.onerror = () => {
            resolve(undefined)
        }
    })
    return data
}

export async function setSetting<T = Record<string, any>>(value: { key: string } & T) {
    const objectStore = await getStore('readwrite')
    objectStore.put(value)
}

export async function removeSetting(key: string) {
    const objectStore = await getStore('readwrite')
    const request = objectStore.delete(key)

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result)
        }
        request.onerror = () => {
            reject()
        }
    })
}