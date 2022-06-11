
import type { ResultWithDoc } from './doc'

export function noscript(result: ResultWithDoc) {
    const { doc, noScript } = result.payload

    if (doc && noScript) {
        const scripts = doc.querySelectorAll('script')
        scripts.forEach((script) => {
            script.parentElement?.removeChild(script)
        })

        const scriptLinks = doc.querySelectorAll('link[ref="script"]')
        scriptLinks.forEach((link) => {
            link.parentElement?.removeChild(link)
        })

        const lazyImages = doc.querySelectorAll<HTMLImageElement>('img[data-src]')
        lazyImages.forEach((img) => {
            if (!img.src) img.src = img.dataset.src as string
            if (!img.loading) img.loading = 'lazy'
            if (!img.width && img.dataset.width) img.width = Number(img.dataset.width)
            if (!img.height && img.dataset.height) img.width = Number(img.dataset.height)
        })

        const noscripts = doc.querySelectorAll('noscript')
        noscripts.forEach((tag) => {
            tag.outerHTML = tag.innerHTML
        })
    }

    return result
}
