

/**
 * @param charset Content-Type charset
 * @returns TextDecoder encoding label
 */
export function charsetToEncoding(charset: string) {
    charset = charset.trim()
    charset = charset.toLowerCase()

    return charset
}

type MediaType = 'text/plain' | 'text/html' | 'image/svg'

export function dataUrl(text: string, type: MediaType, base64 = true) {
    const data = base64 ? 'base64,' + window.btoa(text) : 'charset=utf-8,' + encodeURIComponent(text)
    const url = 'data:' + type + ';' + data
    return url
}