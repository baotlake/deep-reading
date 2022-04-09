
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
    }

    return result
}
