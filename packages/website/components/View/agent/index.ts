import { getProxyUrl, proxyRequest } from './proxy'
import { isInnerUrl, content } from './content'
import { injectToDoc, noscript, recap, parse, srialize, add } from './pipeline'
import type { RequestResult } from './type'


type Options = {
    noScript: boolean
}

export async function request(url: string, options?: Options) {
    const inner = isInnerUrl(url)
    const proxyUrl = getProxyUrl(url, 'tokyo')

    let result: RequestResult | null = null
    if (inner) result = await content(url)
    if (!result) result = await proxyRequest(proxyUrl)

    result = parse(result)
    if (options && options.noScript) {
        result = noscript(result)
    }
    result = injectToDoc(result)
    result = recap(result)
    result = add(result)
    result = srialize(result)

    return result
}

export async function reload() {

}