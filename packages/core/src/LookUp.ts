import { lookUpApi } from './utils/request'
import { init } from './db/historyDB'
import { WordData} from "./types/wrp"

export default class LookUp {
    public onExplain: (data: WordData) => void
    private data: WordData
    private db: IDBDatabase
    private readonly initPromise: Promise<void>

    constructor() {
        this.initPromise = init().then((db) => {
            this.db = db
        })
    }

    private async find(word: string) {
        await this.initPromise
        let transaction = this.db.transaction('words', 'readwrite')
        let objectStore = transaction.objectStore('words')
        let cacheData = await new Promise<WordData>((resolve) => {
            objectStore.get(word).onsuccess = (e) => {
                resolve((e.target as IDBRequest<WordData>).result)
            }
        })
        if (cacheData) {
            this.data = {
                ...cacheData,
                state: 'done',
            }
            return this.data
        }
        return false
    }

    private async push(data: Partial<WordData>) {
        await this.initPromise
        if (!data.word) return
        let transaction = this.db.transaction('words', 'readwrite')
        let objectStore = transaction.objectStore('words')
        return objectStore.add(data)
    }

    private async request(word: string) {
        let apiData = await lookUpApi(word)
        let success = !!apiData.answer
        if (success) {
            this.data.pronunciation = {
                symbol_am: apiData.ph_am,
                symbol_en: apiData.ph_en,
                symbol_other: apiData.ph_other,
                audio_am: apiData.audioUS,
                audio_en: apiData.audioUK,
                audio_other: apiData.audio,
            }
            this.data.answer = apiData.answer
            this.data.state = 'done'
            let data = { ...this.data }
            delete data.state
            this.push(data)
        }

        if (!success) {
            this.data.state = 'fail'
        }
    }

    public async lookUp(word: string) {
        if (!word) return
        this.data = {
            word: word,
            answer: [],
            pronunciation: {
                symbol_am: '',
                symbol_en: '',
                symbol_other: '',
                audio_am: '',
                audio_en: '',
                audio_other: '',
            },
            star: undefined,
            state: 'loading',
            timestamp: Date.now(),
        }

        this.onExplain({ ...this.data })

        if (!(await this.find(word))) {
            await this.request(word)
        }
        console.log('data', this.data)

        this.onExplain({ ...this.data })
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
}
