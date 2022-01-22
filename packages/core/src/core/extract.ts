import { nextText } from "../utils/dom";

export function extractWordRange(node: Text, offset: number) {
    const start = findWordPoint(node, offset, 'start')
    const end = findWordPoint(node, offset, 'end')

    const range = new Range()
    range.setStart(start[0], start[1])
    range.setEnd(end[0], end[1])
    return range
}

export function extractSentenceRange(node: Text, offset: number) {
    const start = findSentencePoint(node, offset, 'start')
    const end = findSentencePoint(node, offset, 'end')

    const range = new Range()
    range.setStart(start[0], start[1])
    range.setEnd(end[0], end[1])
    return range
}

function findWordPoint(node: Text, offset: number, type: 'start' | 'end'): [Text, number] {
    let text: Text = node
    let textOffset: number = offset
    do {
        if (text.nodeName === '#text') {
            const offsetOrFalse = wordBoundaryPointOffset(text, textOffset, type)
            textOffset = offsetOrFalse || (type === 'start' ? 0 : text.textContent?.length || 0)
            if (offsetOrFalse !== false) break
        }
        const [next, inline] = nextText(text, type)
        if (!next || !inline) break
        text = next
        textOffset = type === 'start' ? next.textContent?.length || 0 : 0
    } while (text)
    return [text, textOffset]
}

function wordBoundaryPointOffset(node: Node, offset: number, type: 'start' | 'end') {
    if (type === 'start') {
        let text = node.textContent?.slice(Math.max(0, offset - 100), offset) || ''
        let part = text.match(/\W(\w*?)$/)
        if (part === null) return false
        return offset - part[1].length
    }
    if (type === 'end') {
        let text = node.textContent?.slice(offset) || ''
        let part = text.match(/^(\w*?)\W/)
        if (part === null) return false
        return offset + part[1].length
    }
    return false
}

function findSentencePoint(node: Text, offset: number, type: 'start' | 'end'): [Text, number] {
    let text: Text = node
    let textOffset: number = offset
    do {
        if (text.nodeName === '#text') {
            let breakLoop = false
            let innerLoop = false
            const textLength = text.textContent?.length || 0
            do {
                const offsetOrFalse = sentenceBoundaryPointOffset(text, textOffset, type)
                textOffset = typeof offsetOrFalse === 'number' ? offsetOrFalse : (type === 'start' ? 0 : textLength)

                breakLoop = typeof offsetOrFalse === 'number' && detectSentenceBoundary(text, textOffset)
                innerLoop = !breakLoop && (type === 'start' ? textOffset > 0 : textOffset < textLength)
                innerLoop && (textOffset += type === 'start' ? -1 : 1)
            } while (innerLoop)
            if (breakLoop) break
        }
        const [next, inline] = nextText(text, type)
        if (!next || !inline) break
        text = next
        textOffset = type === 'start' ? next.textContent?.length || 0 : 0
    } while (text)
    return [text, textOffset]
}

function sentenceBoundaryPointOffset(node: Node, offset: number, type: 'start' | 'end') {
    if (type === 'start') {
        let text = node.textContent?.slice(Math.max(0, offset - 500), offset) || ''
        let part = text.match(/[.?!。？！\f\t]([^.?!。？！\f\t]*?)$/)
        if (part === null) return false
        return offset - part[1].length
    }
    if (type === 'end') {
        let text = node.textContent?.slice(offset) || ''
        let part = text.match(/^([^.?!。？！\f\t]*?[.?!。？！\f\t])/)
        if (part === null) return false
        return offset + part[1].length
    }
    return false
}

// Sentence boundary disambiguation
function detectSentenceBoundary(node: Node, offset: number): boolean {
    console.log(
        '%c detect boundary',
        'background: yellowgreen; padding: 5px; border-radius: 4px',
        node.textContent?.slice(0, offset) + '|',
        "|" + node.textContent?.slice(offset),
    )
    const text = node.textContent || ''
    if (!text) return false

    const numeric = text.slice(Math.max(offset - 2, 0), offset + 1)
    if (/\d\.\d/.test(numeric)) return false

    const ellipsis = text.slice(Math.max(offset - 4, 0), offset + 3)
    console.log('ellipsis', ellipsis, /\.\.\./.test(ellipsis))
    if (/\.\.\./.test(ellipsis)) return false

    return true
}