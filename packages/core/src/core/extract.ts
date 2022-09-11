import { nextText } from "../utils/dom"

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
            const offset = wordBoundaryPointOffset(text, textOffset, type)
            if (offset !== -1) {
                textOffset = offset
                break
            }
            textOffset = type === 'start' ? 0 : (text.textContent?.length || 0)
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
        if (part === null) return -1
        return offset - part[1].length
    }
    if (type === 'end') {
        let text = node.textContent?.slice(offset) || ''
        let part = text.match(/^(\w*?)\W/)
        if (part === null) return -1
        return offset + part[1].length
    }
    return -1
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
                const offset = sentenceBoundaryPointOffset(text, textOffset, type)
                textOffset = offset !== -1 ? offset : (type === 'start' ? 0 : textLength)

                breakLoop = offset !== -1 && sentenceBoundaryDisambiguate(text, textOffset)
                innerLoop = !breakLoop && (type === 'start' ? textOffset > 0 : textOffset < textLength)
                innerLoop && (textOffset += (type === 'start' ? -1 : 1))
                console.log('breakLoop', breakLoop, offset, 'innerLoop', innerLoop)
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

function sentenceBoundaryPointOffset(node: Node, offset: number, type: 'start' | 'end'): number {
    if (type === 'start') {
        const start = Math.max(0, offset - 500)
        let text = node.textContent?.slice(start, offset) || ''
        let part = text.match(/[.?!。？！\f\t]([^.?!。？！\f\t]*?)$/)
        if (part === null) return -1
        const step = part[1].length
        const i = offset - step
        const char = text.slice(i - 1 - start, i - start)

        // console.log(i, char)

        if (char.match(/[\n\t]/)) {
            if (node.parentElement?.innerText?.search(char) !== -1) return i
            return sentenceBoundaryPointOffset(node, i - 1, type)
        }

        return i
    }
    if (type === 'end') {
        let text = node.textContent?.slice(offset, offset + 500) || ''
        let part = text.match(/^([^.?!。？！\f\t]*?[.?!。？！\f\t])/)
        if (part === null) return -1

        const step = part[1].length
        const i = offset + step
        const char = text.slice(step - 1, step)

        console.log(i, char)

        if (char.match(/[\n\t]/)) {
            if (node.parentElement?.innerText?.search(char) !== -1) return i
            //step = 1, i不必 +1
            return sentenceBoundaryPointOffset(node, i, type)
        }

        return i
    }
    return -1
}

// Sentence boundary disambiguation
function sentenceBoundaryDisambiguate(node: Node, offset: number): boolean {
    console.log(
        '%c sentence boundary',
        'background: yellowgreen; padding: 5px; border-radius: 4px',
        node.textContent?.slice(0, offset) + '|',
        "|" + node.textContent?.slice(offset),
    )
    const text = node.textContent || ''
    if (!text) return false

    const numeric = text.slice(Math.max(offset - 2, 0), offset + 1)
    if (/\d\.\d/.test(numeric)) return false

    const ellipsis = text.slice(Math.max(offset - 4, 0), offset + 3)
    if (/\.\.\./.test(ellipsis)) return false

    const adjacent = text.slice(Math.max(offset - 2, 0), offset + 1)
    console.log('adjacent', adjacent, /\.([^\S]|$)/.test(adjacent))
    /** 
     * \s  Matches a single white space character, including space, 
     *      tab, form feed, line feed, and other Unicode spaces 
     */
    if (/\.\s/.test(adjacent)) return true
    /** \w  Matches any alphanumeric character from the basic 
     *      Latin alphabet, including the underscore 
     */
    if (/\.\w/.test(adjacent)) return false

    return true
}