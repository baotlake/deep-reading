import { renderUrl } from '../Content'
import type { RequestResult } from './type'
import type { InnerUrl } from '../Content'
import type { State } from '../reducer'

type Options = State['options']

export function isInnerUrl(url: string): url is InnerUrl {
    if (/^https?:\/\//.test(url)) return false
    return true
}

export async function content(url: InnerUrl, options?: Options) {
    const [targetUrl, html] = renderUrl(url)

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
        options: options,
        payload: {},
    }

    return result
}
