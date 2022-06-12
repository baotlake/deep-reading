import { getProxyUrl, proxyRequest } from './proxy'
import { isInnerUrl, content } from './content'
import { injectToDoc, noscript, recap, parse, srialize, add, setOptions } from './pipeline'
import type { RequestResult } from './type'


type Toogle = 'auto' | 'allow' | 'block'

type Options = {
    script?: Toogle
    sameOrigin?: Toogle
}

export async function request(url: string, options?: Options) {
    const inner = isInnerUrl(url)
    const proxyUrl = getProxyUrl(url, 'tokyo')

    let result: RequestResult | null = null
    if (inner) result = await content(url)
    if (!result) result = await proxyRequest(proxyUrl)

    result = parse(result)
    result = setOptions(result, options)
    result = noscript(result)
    result = await injectToDoc(result)
    result = recap(result)
    result = add(result)
    result = srialize(result)

    return result
}

export async function reload() {

}


export { fallbackLoadError } from './fallback'