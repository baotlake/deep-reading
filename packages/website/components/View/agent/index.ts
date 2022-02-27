import { getProxyUrl, proxyRequest } from './proxy'
import { isInnerUrl, content } from './content'
import { injectToDoc, noscript, recap } from './pipeline'
import type { RequestResult } from './type'
import { parse, srialize } from './pipeline/doc'


export async function request(url: string) {
    const inner = isInnerUrl(url)
    const proxyUrl = getProxyUrl(url, 'tokyo')

    let result: RequestResult | null = null
    if (inner) result = await content(url)
    if (!result) result = await proxyRequest(proxyUrl)

    // result = inject(result)

    result = parse(result)
    result = recap(result)
    // result = noscript(result)
    result = injectToDoc(result)
    result = srialize(result)

    return result
}

export async function reload() {

}