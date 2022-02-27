import type { RequestResult } from './type'
import { charsetToEncoding } from '../utils/encoding'

export type ServerPoint = 'shanghai' | 'tokyo'

export function getProxyUrl(src: string, serverPoint?: ServerPoint) {
    let api = process.env.SHANGHAI_PROXY_API

    switch (serverPoint) {
        case 'shanghai':
            api = process.env.SHANGHAI_PROXY_API
            break
        case 'tokyo':
            api = process.env.TOKYO_PROXY_API
            break
        default:
            api = process.env.SHANGHAI_PROXY_API
    }

    const url = api + '?url=' + encodeURIComponent(src)
    return url
}

function decodeText(arrayBuffer: ArrayBuffer, contentType: string) {
    const textType = contentType && contentType.match(/text\//)
    if (!textType) return ''

    const charsetMatch = contentType && contentType.match(/charset="?([\w-]+)["\s;]?/)
    const charset = charsetMatch ? charsetMatch[1] : 'utf-8'
    let text = new TextDecoder(charsetToEncoding(charset)).decode(arrayBuffer)
    if (!charsetMatch) {
        const metaMatch = text.match(/<meta\s+http-equiv=['"]Content-Type['"]\s+content=['"](.+?)['"]/)
        const metaCharsetMatch = metaMatch && metaMatch[1].match(/charset="?([\w-]+)["\s;]?/)
        const metaCharset = metaCharsetMatch && metaCharsetMatch[1]

        console.log('metaMatch', metaMatch, metaCharset)

        if (metaCharset) {
            text = new TextDecoder(charsetToEncoding(metaCharset)).decode(arrayBuffer)
            console.log(text)
        }
    }
    return text
}

export async function proxyRequest(url: string) {
    const response = await fetch(url)
    const { ok, headers, status, redirected } = response
    const finalUrl = new URL(response.url)
    const targetUrl = finalUrl.searchParams.get('url') || ''

    const arrayBuffer = await response.arrayBuffer()
    const contentType = headers.get('Content-Type') || ''

    const text = decodeText(arrayBuffer, contentType)

    const result: RequestResult<{}> = {
        headers: headers,
        ok: ok,
        redirected: redirected,
        status: status,
        url: targetUrl,
        html: text,
        content: {
            text: text,
            blob: new Blob([arrayBuffer])
        },
        payload: {}
    }

    Object.freeze(result.content)
    return result
}
