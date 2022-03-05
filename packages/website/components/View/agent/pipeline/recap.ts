
import type { ResultWithDoc } from './doc'


export type ResultWithRecap<T = Record<any, any>> = ResultWithDoc<{
    title: string
    favicon: string
    description: string
} & T>

export function recap(result: ResultWithRecap) {
    const { doc } = result.payload
    if (doc) {
        const title = doc.querySelector<HTMLTitleElement>('title')?.text
        let favicon = doc.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href
        const url = /^https?:\/\//.test(result.url) && new URL(result.url)

        if (!favicon && url) favicon = url.origin + '/favicon.ico'

        let description = doc.querySelector<HTMLMetaElement>('meta[name="description"]')?.content

        result.payload.title = title || ''
        result.payload.favicon = favicon || ''
        result.payload.description = description || ''
    }

    return result
}