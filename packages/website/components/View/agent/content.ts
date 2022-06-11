import { renderUrl } from '../Content'
import type { RequestResult } from './type'
import type { InnerUrl } from '../Content'

export function isInnerUrl(url: string): url is InnerUrl {
    if (/^https?:\/\//.test(url)) return false
    return true
}

export async function content(url: InnerUrl) {
    const [targetUrl, html] = renderUrl(url)

    // console.log('content render', html)

    const result: RequestResult<{}> = {
        headers: new Headers(),
        ok: true,
        redirected: url !== targetUrl,
        status: 200,
        error: false,
        url: targetUrl,
        html: html,
        content: {
            text: html,
            blob: new Blob([html]),
        },
        payload: {},
    }

    return result
}
