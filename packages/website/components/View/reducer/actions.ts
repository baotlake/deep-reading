import type { RequestResult } from "../agent/type"


export function open(url: string) {
    return {
        type: 'open',
        payload: {
            loading: true,
            pendingUrl: url,
            favIconUrl: '',
        }
    }
}

export function loaded(result: RequestResult) {
    const { url, html } = result
    const blob = new Blob([html], { type: 'text/html' })
    const src = URL.createObjectURL(blob)

    return {
        type: 'loaded',
        payload: {
            loading: false,
            url: url,
            // favIconUrl: '',
            // title: '',
            frameSrc: src,
        }
    }
}