/// <reference path="../../../../module.d.ts" />

import contentScript from '@wrp/inject/dist/website.js?raw'
import type { RequestResult } from '../type'
import type { ResultWithDoc } from './doc'

export function injectToDoc(result: ResultWithDoc, options?: {}) {
    const { doc } = result.payload

    if (doc) {
        let base = doc.querySelector('base')

        if (base) {
            const path = new URL(base.href).pathname
            const href = new URL(path, result.url).href
            console.log('base.href', base.href, result.url, href)
            base.href = href
        }

        if (!base) {
            base = doc.createElement('base')
            base.href = result.url
            doc.head.insertBefore(base, doc.head.firstChild)
        }

        const script = doc.createElement('script')
        script.type = 'module'
        script.text = contentScript

        doc.head.insertBefore(script, doc.head.firstChild)
    }

    return result
}








function inject(result: RequestResult, options?: {}) {
    const { html, url } = result
    let offset = html.search(/(?<=<html[^>]*?>[\s\S]*?<((head)|(meta)|(link)|(script))[^>]*?>)/)
    if (offset === -1) offset = html.search(/(?<=<[\w]+?>)/)

    let newHtml = ''
    if (offset === -1) {
        newHtml = '<html><head><base href="' + url + '"><script type="module">' + contentScript + '</script></head>' + html + '</html>'
    } else {
        newHtml = html.slice(0, offset) + '<base href="' + url + '"><script type="module">' + contentScript + '</script>' + html.slice(offset)
    }

    result.html = newHtml
    return result
}