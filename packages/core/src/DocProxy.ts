import {proxyApi, ServerPoint} from './utils/request'
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

    constructor() {

    }

    public async request(url: string) {
        let data = await this.requestApi(url)
        return data
    }

    private pickServerPoint(url: string): ServerPoint {
        let host = (new URL(url)).host
        if (proxyHostList.includes(host)) return 'tokyo'
        return 'tokyo'
        return 'shanghai'
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
            data.url = url.searchParams.get('url') as string
            const arrayBuffer = await response.arrayBuffer()
            const contentType = response.headers.get('Content-Type') || ''
            const charsetMatch = contentType.match(/charset=(.+)[\s;]?/)
            const utfLabel = charsetMatch ? charsetMatch[1] : 'utf8'
            const decoder = new TextDecoder(utfLabel)
            data.docString = decoder.decode(arrayBuffer)

            if (contentType.search('charset') === -1) {
                const match = data.docString.match(/<meta\s+http-equiv=['"]Content-Type['"]\s+content=['"](.+?)['"]/)
                const charsetMatch = match && match[1].match(/charset=(.+)[\s;]?/)
                const charset = charsetMatch && charsetMatch[1]
                if (charset) {
                    const decoder = new TextDecoder(charset)
                    const text = decoder.decode(arrayBuffer)
                    data.docString = text
                }
            }
            data.status = Status.success
            return data
        }

        data.status = Status.failed
        return data
    }
}
