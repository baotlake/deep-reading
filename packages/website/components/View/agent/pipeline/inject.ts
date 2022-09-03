/// <reference path="../../../../module.d.ts" />

import type { RequestResult } from '../type'
import type { ResultWithDoc } from './doc'

// import contentScript from '@wrp/inject/dist/website.js?raw'

const importContent: { default: string } = import('@wrp/inject/dist/website.js?raw') as any


export function injectBase(result: ResultWithDoc) {
    const { doc } = result.payload
    if (doc) {
        const base = doc.querySelector('base')
        if (base) {
            const path = new URL(base.href).pathname
            const href = new URL(path, result.url).href
            console.log('base.href', base.href, result.url, href)
            base.href = href
        }
        if (!base) {
            const newBase = doc.createElement('base')
            newBase.href = result.url
            doc.head.insertBefore(newBase, doc.head.firstChild)
        }
    }

    return result
}

export async function injectScript(result: ResultWithDoc, options?: {}) {
    const { doc } = result.payload
    if (doc) {
        const { default: rawScript } = await importContent
        // console.log('rawScript', rawScript)

        const script = doc.createElement('script')
        script.type = 'module'
        script.text = rawScript

        doc.head.insertBefore(script, doc.head.firstChild)
    }

    return result
}
