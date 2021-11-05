import {lookUpApi} from './utils/request'
import {init} from './db/historyDB'
import {WordData} from "./types/wrp"

export default class Dictionary {
    private db: IDBDatabase
    private readonly initPromise: Promise<void>

    constructor() {
        this.initPromise = init().then((db) => {
            this.db = db
        })
    }

    public async search(word: string) {
        if (!word) return
        word = word.toLowerCase().trim()
        const data = await this.queryDB(word)
        if (data === false || data.timestamp < 1635590345237) {
            const newData = await this.request(word)
            const personaliseData: Partial<WordData> = {
                star: data && !!data.star,
                timestamp: Date.now()
            }
            if (newData) {
                const finalData = {
                    ...newData,
                    ...personaliseData,
                } as WordData

                this.save(finalData, data !== false)
                return finalData
            }

            return {
                error: 'Error',
            }
        }

        return data
    }

    public async geHistory(limit: number) {
        await this.initPromise
        let transaction = this.db.transaction('words', 'readonly')
        let objectStore = transaction.objectStore('words')

        let itemList = await new Promise<WordData[]>((resolve) => {
            let list: WordData[] = []

            objectStore.openCursor(null, 'next').onsuccess = (e) => {
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

    private async queryDB(word: string) {
        await this.initPromise
        let transaction = this.db.transaction('words', 'readwrite')
        let objectStore = transaction.objectStore('words')
        let cacheData = await new Promise<WordData>((resolve) => {
            const request = objectStore.get(word)
            request.onsuccess = () => {
                resolve(request.result)
            }
        })
        if (cacheData) {
            return cacheData
        }

        return false
    }

    private async save(data: Partial<WordData>, update = false) {
        await this.initPromise
        if (!data.word) return
        let transaction = this.db.transaction('words', 'readwrite')
        let objectStore = transaction.objectStore('words')
        if (!update) {
            return objectStore.add(data)
        }
        return objectStore.put(data)
    }

    private async request(word: string) {
        let apiData = await lookUpApi(word)
        let success = !!apiData.answer
        if (success) {
            const data: Partial<WordData> = {
                word: word,
                pronunciation: {
                    symbol_am: apiData.ph_am,
                    symbol_en: apiData.ph_en,
                    symbol_other: apiData.ph_other,
                    audio_am: apiData.audioUS,
                    audio_en: apiData.audioUK,
                    audio_other: apiData.audio,
                },
                answer: apiData.answer,
            }
            return data
        }
        return false
    }
}
