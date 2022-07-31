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
} from './pipeline'
import type { RequestResult } from './type'


export { history } from './pipeline'

type Toogle = 'auto' | 'allow' | 'block'

type Options = {
    script?: Toogle
    sameOrigin?: Toogle
}

export async function request(url: string, options?: Options) {
    const inner = isInnerUrl(url)

    let result: RequestResult | null = null
    if (inner) result = await content(url)
    if (!result) result = await proxyRequest(url)

    result = parse(result)
    result = setOptions(result, options)
    result = noscript(result)
    result = await injectToDoc(result)
    result = recap(result)
    result = await pushHistory(result)
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