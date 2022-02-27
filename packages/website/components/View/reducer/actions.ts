import type { RequestResult } from "../agent/type"


export function open(url: string) {
    return {
        type: 'open',
        payload: {
            loading: true,
            loaded: false,
            pendingUrl: url,
            favIconUrl: '',
        }
    }
}

export function docLoaded(result: RequestResult) {
    const { url, html, payload } = result
    const blob = new Blob([html], { type: 'text/html' })
    const src = URL.createObjectURL(blob)

    return {
        type: 'docLoaded',
        payload: {
            loading: false,
            url: url,
            favicon: payload?.favicon,
            title: payload?.title,
            frameSrc: src,
        }
    }
}

export function contentLoaded() {
    return {
        type: 'contentLoaded',
        payload: {
            loaded: true,
        }
    }
}