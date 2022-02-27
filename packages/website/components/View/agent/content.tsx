import { renderToStaticMarkup } from 'react-dom/server'
import { Blank } from '../Content'
import type { RequestResult } from './type'


export function isInnerUrl(url: string) {
    if (/^https?:\/\//.test(url)) return false
    return true
}

export async function content(url: string) {
    let html = ''
    let targetUrl = url

    console.log('content render')

    switch (url) {
        case '':
        case 'about:blank':
            html = renderToStaticMarkup(<Blank />)
            targetUrl = 'about:blank'
            break
    }

    const result: RequestResult<{}> = {
        headers: new Headers(),
        ok: true,
        redirected: url !== targetUrl,
        status: 200,
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
