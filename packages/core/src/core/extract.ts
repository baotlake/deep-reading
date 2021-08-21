import {objectSize} from "pdfjs-dist/types/shared/util";

enum RangeType {
    'word',
    'sentence',
}

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

function findStartPoint(
    node: Text,
    offset: number,
    type: RangeType
): [Text, number] {
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
        if (next === undefined) {
            break
        }
        if (!nextIsInline) {
            break
        }
        start = next
        startOffset = next.textContent.length
    } while (start)

    return [start, startOffset]
}

function findEndPoint(
    node: Text,
    offset: number,
    type: RangeType
): [Text, number] {
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
                endOffset = end.textContent.length
            }
        }

        let [next, nextIsInline] = nextText(end, 'end')
        if (next === undefined) {
            break
        }
        if (!nextIsInline) {
            break
        }
        end = next
        endOffset = 0
    } while (end)

    return [end, endOffset]
}

function isInline(target: Node) {
    if (process.env.NODE_ENV !== 'production') {
        if (!target) {
            console.error('isInline(target: Node) target: ', target)
            return false
        }
    }

    if (target.nodeName === '#text') return true
    if (target.nodeName === '#comment') return true
    if (['TEXT', 'TSPAN'].includes(target.nodeName)) return true
    if (['svg', 'IFRAME', 'HTML'].includes(target.nodeName)) return false

    let display = window.getComputedStyle(target as Element).display
    if (display.startsWith('inline')) return true
    return false
}

type Inline = boolean

function nextText(node: Node, type: 'start' | 'end'): [Text | null, Inline] {
    let nextData = nextLeafNode(node, type)

    console.log('nextData -> ', nextData, type)
    while (nextData[0] && nextData[0].nodeName !== '#text') {
        if (nextData[0].childNodes.length === 0) {
            let newNext = nextLeafNode(nextData[0], type)
            newNext[1] = newNext[1] && nextData[1]

            nextData = newNext

            if (newNext[0] === null) {
                console.error('newNext', newNext)
                console.log('node', node)
            }

            continue
        }

        // 跳过
        if (['svg'].includes(nextData[0].nodeName)) {
            if (nextData[0].previousSibling) {
                return [nextText(nextData[0].previousSibling, type)[0], false]
            }
            return [nextText(nextData[0].parentNode, type)[0], false]
        }

        if (type === 'start') {
            let newNextNode = nextData[0].lastChild
            nextData = [newNextNode, nextData[1] && isInline(newNextNode)]
            continue
        }

        if (type === 'end') {
            let newNextNode = nextData[0].firstChild
            nextData = [newNextNode, nextData[1] && isInline(newNextNode)]
            continue
        }
    }

    if (nextData[0] && nextData[0].nodeName !== '#text') {
        console.error(
            'An error occurred ad function: nextText ',
            nextData,
            node
        )
    }

    return nextData as [Text, Inline]
}

/** 查找下一个叶子结点，以及和下一个叶子结点之间的关系(是否inline) */
function nextLeafNode(currentNode: Node, type: 'start' | 'end'): [Node | null, Inline] {
    if (type === 'start') {
        if (currentNode.previousSibling) {
            return [
                currentNode.previousSibling,
                isInline(currentNode.previousSibling),
            ]
        }

        if (currentNode.parentNode.previousSibling) {
            if (currentNode.parentNode.previousSibling.lastChild) {
                return [
                    currentNode.parentNode.previousSibling.lastChild,
                    isInline(currentNode.parentNode) &&
                    isInline(currentNode.previousSibling) &&
                    isInline(currentNode.previousSibling.lastChild),
                ]
            }
            return [
                currentNode.parentNode.previousSibling,
                isInline(currentNode.parentNode) &&
                isInline(currentNode.parentNode.previousSibling),
            ]
        }

        let next = nextLeafNode(currentNode.parentNode, type)
        next[1] = next[1] && isInline(currentNode.parentNode)

        return next
    }

    if (type === 'end') {
        if (currentNode.nextSibling) {
            return [currentNode.nextSibling, isInline(currentNode.nextSibling)]
        }

        if (currentNode.parentNode.nextSibling) {
            if (currentNode.parentNode.nextSibling.firstChild) {
                return [
                    currentNode.parentNode.nextSibling.firstChild,
                    isInline(currentNode.parentNode) &&
                    isInline(currentNode.parentNode.nextSibling) &&
                    isInline(currentNode.parentNode.nextSibling.firstChild),
                ]
            }
            return [
                currentNode.parentNode.nextSibling,
                isInline(currentNode.parentNode) &&
                isInline(currentNode.parentNode.nextSibling),
            ]
        }

        let next = nextLeafNode(currentNode.parentNode, type)
        next[1] = next[1] && isInline(currentNode.parentNode)

        return next
    }
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
}

function wordBoundaryPointOffset(node: Node, offset: number, type: 'start' | 'end') {
    if (type === 'start') {
        let text = node.textContent.slice(Math.max(0, offset - 100), offset)
        let part = text.match(/\W(\w*?)$/)
        if (part === null) return false
        return offset - part[1].length
    }

    if (type === 'end') {
        let text = node.textContent.slice(offset)
        let part = text.match(/^(\w*?)\W/)
        if (part === null) return false
        return offset + part[1].length
    }
}

function sentenceBoundaryPointOffset(
    node: Node,
    offset: number,
    type: 'start' | 'end'
) {
    if (type === 'start') {
        let text = node.textContent.slice(Math.max(0, offset - 500), offset)
        let part = text.match(/[.?!。？！\n\f\t]([^.?!。？！\n\f\t]*?)$/)
        if (part === null) return false
        return offset - part[1].length
    }

    if (type === 'end') {
        let text = node.textContent.slice(offset)
        let part = text.match(/^([^.?!。？！\n\f\t]*?[.?!。？！\n\f\t])/)
        if (part === null) return false
        return offset + part[1].length
    }
}
