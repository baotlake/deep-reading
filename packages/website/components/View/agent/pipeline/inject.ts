/// <reference path="../../../../module.d.ts" />

import contentScript from '@wrp/inject/dist/website.js?raw'
import type { RequestResult } from '../type'


export function inject(result: RequestResult, options?: {}) {
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

