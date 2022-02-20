import { getProxyUrl, proxyRequest } from './proxy'
import { isInnerUrl, content } from './content'
import { inject } from './pipeline/inject'
import type { RequestResult } from './type'


export async function request(url: string) {
    const inner = isInnerUrl(url)
    const proxyUrl = getProxyUrl(url, 'tokyo')

    let result: RequestResult | null = null
    if (inner) result = await content(url)
    if (!result) result = await proxyRequest(proxyUrl)

    result = inject(result)

    return result
}

export async function reload() {
    
}