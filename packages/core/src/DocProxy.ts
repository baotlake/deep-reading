import {proxyApi, ServerPoint} from './utils/request'
import {init} from './db/historyDB'
import {proxyHostList} from "./utils/host"

enum Status {
    loading = 'loading',
    success = 'success',
    timeout = 'timeout',
    error = 'error',
    failed = 'failed',
}

export interface DocData {
    url: string
    docString: string
    createdAt: number
    serverPoint: ServerPoint
    status: Status
}

export default class DocProxy {
    private db: IDBDatabase
    private initPromise: Promise<void>

    constructor() {
        this.initPromise = init().then((db) => {
            this.db = db
        })
    }

    public async request(url: string) {
        let data = await this.find(url)
        if (data === false) {
            data = await this.requestApi(url)
        }
        return data
    }

    private pickServerPoint(url: string): ServerPoint {
        let host = (new URL(url)).host
        if (proxyHostList.includes(host)) return 'tokyo'
        return 'tokyo'
        return 'shanghai'
    }

    private async find(url: string) {
        await this.initPromise
        let transaction = this.db.transaction('doc', 'readonly')
        let objectStore = transaction.objectStore('doc')
        let cacheData = await new Promise<DocData>((resolve) => {
            objectStore.get(url).onsuccess = (e) => {
                resolve((e.target as IDBRequest).result)
            }
        })

        if (cacheData) {
            let expire = Date.now() - cacheData.createdAt
            // 1 day
            if (expire > 1000 * 60 * 60 * 24) {
                console.log('expire ', expire, url)
                this.requestApi(url)
            }

            if(! (cacheData.status in Status)) {
                cacheData.status = Status.success
                this.cache(cacheData)
            }
            return cacheData
        }
        return false
    }

    private async cache(data: DocData) {
        await this.initPromise
        let transaction = this.db.transaction('doc', 'readwrite')
        let objectStore = transaction.objectStore('doc')
        return objectStore.add(data)
    }

    private async requestApi(url: string) {
        let serverPoint = this.pickServerPoint(url)
        let data: DocData = {
            url: url,
            docString: '',
            createdAt: Date.now(),
            serverPoint,
            status: Status.loading,
        }
        let request = proxyApi(url, serverPoint)
        request.catch((e) => {
            data.status = Status.error
        })
        let response = await request

        if (response.status >= 200 && response.status <= 299) {
            const url = new URL(response.url)
            data.url = url.searchParams.get('url')
            data.docString = await response.text()
            data.status = Status.success
            this.cache(data)
            return data
        }

        data.status = Status.failed
        return data
    }
}
