import { getProxyUrl, proxyRequest } from './proxy'
import { isInnerUrl, content } from './content'
import {
    injectToDoc,
    noscript,
    recap,
    parse,
    srialize,
    pushHistory,
    updateHistory,
    setOptions,
    readerMode,
} from './pipeline'
import type { RequestResult } from './type'
import type { State } from '../reducer'


export { history } from './pipeline'

type Options = State['options']

export async function request(url: string, options?: Options) {
    const inner = isInnerUrl(url)

    let result: RequestResult | null = null
    if (inner) result = await content(url)
    if (!result) result = await proxyRequest(url)

    result = parse(result)
    result = setOptions(result, options)
    result = noscript(result)
    result = recap(result)
    result = await pushHistory(result)
    result = readerMode(result)
    result = await injectToDoc(result)
    result = srialize(result)

    return result
}

export async function reload() {

}


export async function update(result: RequestResult) {
    if (result.payload.historyKey) {
        await updateHistory(result.payload.historyKey, result)
    }
}


export { fallbackLoadError } from './fallback'