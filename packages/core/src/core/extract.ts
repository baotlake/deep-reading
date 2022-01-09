import { nextText } from "../utils/dom";

enum RangeType {
    'word',
    'sentence',
}

type ExtractType = 'word' | 'sentence'

export function extractWordRange(node: Text, offset: number) {
    if (process.env.NODE_ENV !== 'production') {
        if (node.nodeName !== '#text') {
            throw Error(
                'extractWordRange(node: Text, offset: number) need "Text" Node'
            )
        }
    }

    let start = findStartPoint(node, offset, RangeType.word)
    let end = findEndPoint(node, offset, RangeType.word)

    console.log('node: ', node, 'offset: ', offset)
    console.log('start: ', start, 'end', end)

    let range = new Range()
    range.setStart(start[0], start[1])
    range.setEnd(end[0], end[1])

    return range
}

export function extractSentenceRange(node: Text, offset: number) {
    let start = findStartPoint(node, offset, RangeType.sentence)
    let end = findEndPoint(node, offset, RangeType.sentence)

    console.log('start', start, 'end', end)

    let range = new Range()
    range.setStart(start[0], start[1])
    range.setEnd(end[0], end[1])

    return range
}

function findStartPoint(node: Text, offset: number, type: RangeType): [Text, number] {
    let start: Text = node
    let startOffset: number = offset

    do {
        if (start.nodeName === '#text') {
            let offsetOrFalse = rangeBoundaryPointOffset(
                start,
                startOffset,
                'start',
                type
            )
            if (offsetOrFalse !== false) {
                startOffset = offsetOrFalse
                break
            }
            if (offsetOrFalse === false) {
                startOffset = 0
            }
        }

        let [next, nextIsInline] = nextText(start, 'start')
        // if (!next) {
        //     break
        // }
        // if (!nextIsInline) {
        //     break
        // }
        if (next && nextIsInline) {
            start = next
            startOffset = next.textContent?.length || 0
        } else {
            break
        }
    } while (start)

    return [start, startOffset]
}

function findEndPoint(node: Text, offset: number, type: RangeType): [Text, number] {
    let end: Text = node
    let endOffset: number = offset

    do {
        if (end.nodeName === '#text') {
            let offsetOrFalse = rangeBoundaryPointOffset(
                end,
                endOffset,
                'end',
                type
            )
            if (offsetOrFalse !== false) {
                endOffset = offsetOrFalse
                break
            }
            if (offsetOrFalse === false) {
                endOffset = end.textContent?.length || 0
            }
        }

        let [next, nextIsInline] = nextText(end, 'end')
        // if (next === undefined) {
        //     break
        // }
        // if (!nextIsInline) {
        //     break
        // }
        if (next && nextIsInline) {
            end = next
            endOffset = 0
        } else {
            break
        }

    } while (end)

    return [end, endOffset]
}

function rangeBoundaryPointOffset(
    node: Node,
    offset: number,
    type: 'start' | 'end',
    rangeType: RangeType
): number | false {
    if (rangeType === RangeType.word) {
        return wordBoundaryPointOffset(node, offset, type)
    }

    if (rangeType === RangeType.sentence) {
        return sentenceBoundaryPointOffset(node, offset, type)
    }
    return false
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
