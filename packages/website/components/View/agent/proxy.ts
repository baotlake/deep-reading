import type { RequestResult } from './type'
import { charsetToEncoding } from '../utils/encoding'
import { renderUrl } from '../Content'
import type { State } from '../reducer'
import { optionsPolicy } from './options'

type Options = State['options']
export type ServerPoint = 'shanghai' | 'tokyo'

export function getProxyUrl(src: string, serverPoint?: ServerPoint, query?: Record<string, string>) {

    if (/^https?:\/\/localhost(:|\/|$)/.test(src)) {
        return src
    }

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

    const params = new URLSearchParams({
        url: src,
        ...query,
    })

    const url = api + '?' + params.toString()
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

        // console.log('metaMatch', metaMatch, metaCharset)

        if (metaCharset) {
            text = new TextDecoder(charsetToEncoding(metaCharset)).decode(arrayBuffer)
            // console.log(text)
        }
    }
    return text
}

function proxyCatch(url: string, error: unknown | Error, options?: Options) {
    // console.log('error: ', error)
    const pass = /https?:\/\//.test(url)
    const queryUrl = pass ? new URL(url).searchParams.get('url') : ''
    const [, html] = renderUrl('about:failed', { url: queryUrl, error })
    const result: RequestResult = {
        headers: null,
        ok: false,
        redirected: false,
        status: 500,
        error: true,
        url: url,
        html: html,
        content: {
            text: html,
            blob: new Blob([html])
        },
        options: options,
        payload: {},
    }

    return result
}

export async function proxyRequest(url: string, options?: Options) {
    try {
        const proxyUrl = getProxyUrl(url, 'tokyo')
        const response = await fetch(proxyUrl)
        const { ok, headers, status, redirected } = response
        const finalUrl = new URL(response.url)
        const targetUrl = finalUrl.searchParams.get('url') || ''

        const arrayBuffer = await response.arrayBuffer()
        const contentType = headers.get('Content-Type') || ''

        const text = decodeText(arrayBuffer, contentType)

        if (status >= 500 && status <= 599 && text === "") {
            // console.warn('text:', text)
            throw Error(text)
        }

        const result: RequestResult<{}> = {
            headers: headers,
            ok: ok,
            redirected: redirected,
            status: status,
            error: false,
            url: targetUrl,
            html: text,
            content: {
                text: text,
                blob: new Blob([arrayBuffer])
            },
            options: options,
            payload: {}
        }

        if (options) {
            const policy = optionsPolicy(options)
            result.options = options
            result.payload = {
                ...result.payload,
                ...policy,
            }
        }

        Object.freeze(result.content)
        return result
    } catch (error) {
        return proxyCatch(url, error, options)
    }
}


