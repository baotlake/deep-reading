
import type { RequestResult } from '../type'

export type ResultWithDoc<T = Record<any, any>> = RequestResult<
    {
        doc: Document | null
    } & T
>

export function parse(result: RequestResult): ResultWithDoc {
    const parser = new DOMParser()

    const doc = parser.parseFromString(result.html, 'text/html')

    const meta = doc.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')
    if (meta) meta.content = meta.content.replace(/charset=[^;\s]+/, 'charset=UTF-8')
    result.payload.doc = doc

    return result
}

export function srialize(result: ResultWithDoc) {
    const srializer = new XMLSerializer()
    const { doc } = result.payload

    // const xml = doc ? srializer.serializeToString(doc) : result.html
    const xml = doc ? doc.children[0].outerHTML : result.html
    result.html = xml

    return result
}
