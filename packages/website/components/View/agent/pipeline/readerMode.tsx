import { Readability, isProbablyReaderable } from '@mozilla/readability'
import { ReaderMode } from '../../Content'
import { renderToStaticMarkup } from 'react-dom/server'

import type { ResultWithDoc } from './doc'

export function readerMode(result: ResultWithDoc) {
    const { doc, readerMode } = result.payload

    if (doc && readerMode && isProbablyReaderable(doc)) {
        const docClone = doc.cloneNode(true) as Document
        const article = new Readability(docClone).parse()
        console.log('Readability article', article)

        if (article && article.content) {
            const html = renderToStaticMarkup(<ReaderMode title={article.title} content={article.content} />)
            result.payload.doc = new DOMParser().parseFromString(html, 'text/html')
        }
    }

    return result
}