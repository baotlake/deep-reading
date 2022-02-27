
import type { ResultWithDoc } from './doc'


type ResultWithRecap<T = Record<any, any>> = ResultWithDoc<{
    title: string
    favicon: string
} & T>

export function recap(result: ResultWithRecap) {
    const { doc } = result.payload
    if (doc) {
        const title = doc.querySelector<HTMLTitleElement>('title')?.text
        let favicon = doc.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href
        const url = /^https?:\/\//.test(result.url) && new URL(result.url)

        if (!favicon && url) favicon = url.origin + '/favicon.ico'

        result.payload.title = title || ''
        result.payload.favicon = favicon || ''
    }

    return result
}