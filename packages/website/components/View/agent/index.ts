import { getProxyUrl, proxyRequest } from './proxy'
import { isInnerUrl, content } from './content'
import {
    injectBase,
    injectScript,
    noscript,
    recap,
    parse,
    srialize,
    pushHistory,
    updateHistory,
    readerMode,
} from './pipeline'
import type { RequestResult } from './type'
import type { State } from '../reducer'
export { history } from './pipeline'
export { precheck, reloadPrecheck } from './precheck'

type Options = State['options']

export async function request(url: string, options: Options) {
    const inner = isInnerUrl(url)

    let result: RequestResult | null = null
    if (inner) result = await content(url, options)
    if (!result) result = await proxyRequest(url, options)

    result = parse(result)
    result = readerMode(result)
    result = noscript(result)
    result = injectBase(result)
    result = recap(result)
    result = await pushHistory(result)
    result = await injectScript(result)
    result = srialize(result)

    return result
}

export async function reload(result: RequestResult, options: Options) {
    const url = result.url
    const count = result.payload.reloadCount || 0
    // if (count > 10) {
    //     return result
    // }
    const newResult = await request(url, options)
    newResult.payload.reloadCount = count + 1
    return newResult
}


export async function update(result: RequestResult) {
    if (result.payload.historyKey) {
        await updateHistory(result.payload.historyKey, result)
    }
}


export { fallbackLoadError } from './fallback'