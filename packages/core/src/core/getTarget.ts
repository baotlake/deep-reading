import { elementsFromPoint } from '../utils/dom'


export function getTarget(x: number, y: number): [Text, number] | null {

    const selection = window.getSelection()
    const range = selection && selection.rangeCount >= 1 && selection.getRangeAt(0).cloneRange()
    if (
        range &&
        range.startContainer instanceof Text &&
        range.startContainer == range.endContainer
    ) {

        const start = Math.max(0, range.startOffset - 1)
        const end = Math.min(range.endOffset + 1, range.endContainer.textContent?.length || 0)
        range.setStart(range.startContainer, start)
        range.setEnd(range.endContainer, end)
        const rect = range.getBoundingClientRect()
        const m = 2

        // console.log('target: selection', range, rect, x, y)
        // console.log(range.startContainer, start)

        if (
            rect.top < y + m &&
            rect.bottom > y - m &&
            rect.right > x - m &&
            rect.left < x + m
        ) {
            return [range.startContainer, range.startOffset]
        }
    }

    return getTargetByPoint(x, y)
}

export function getTargetByPoint(x: number, y: number): [Text, number] | null {
    const elements = elementsFromPoint(x, y)

    const targetList = []
    // find elments that has "Text" type children
    for (let element of elements) {
        if (!hasTextChild(element)) continue
        if (element.textContent?.length === 0) continue
        targetList.push(element)
    }

    console.log('targetList', targetList, elements)

    for (let e of targetList) {
        const target = pointTarget(e, x, y)
        console.log('getTargetByPoint Target: ', target)
        if (target) {
            return target
        }
    }
    return null
}

function hasTextChild(element: Element) {
    for (let i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeName === '#text') return true
    }
    return false
}

/** not suitable for mutli-level nesting */
function pointTarget(node: Node, x: number, y: number): [Text, number] | null {
    for (let i = 0; i < node.childNodes.length; i++) {
        const text = node.childNodes[i]
        if (text.nodeName === '#text') {
            if (!text.textContent?.trim()) continue
            console.log('#text', text, i)
            const offsetOrFalse = pointTextOffset(text as Text, x, y)
            if (offsetOrFalse !== -1) return [text as Text, offsetOrFalse]
        }
    }

    return null
}

function pointTextOffset(target: Text, x: number, y: number): number {
    // not suitable for rotate Element
    return dichotomyFindPointTextOffset(target, x, y)
}

/**
 * 二分法查找
 * @param target
 * @param x
 * @param y
 */
function dichotomyFindPointTextOffset(target: Text, x: number, y: number) {
    const length = target.textContent?.length || 0
    const range = new Range()
    const offsetRange = [0, length]

    console.log('dichotomy find ...', offsetRange, x, y)

    let i = 0

    while (offsetRange[1] - offsetRange[0] >= 1) {
        i++
        if (i > 300) {
            console.log('break loop')
            break
        }

        const middle = Math.round((offsetRange[0] + offsetRange[1]) / 2)

        range.setStart(target, middle)
        range.setEnd(target, middle)

        const position = range.getBoundingClientRect()

        console.log('position: ', i, middle, position)

        if (offsetRange[1] - offsetRange[0] <= 1) {
            range.setStart(target, offsetRange[0])
            range.setEnd(target, offsetRange[1])
            const rect = range.getBoundingClientRect()
            range.detach()
            const margin = 2
            if (
                rect.top < y + margin &&
                rect.bottom > y - margin &&
                rect.right > x - margin &&
                rect.left < x + margin
            ) {
                return offsetRange[0]
            }
            return -1
        }

        if (position.bottom < y) {
            offsetRange[0] = middle
            continue
        }

        if (position.top > y) {
            offsetRange[1] = middle
            continue
        }

        if (position.right < x) {
            offsetRange[0] = middle
            continue
        }

        if (position.left > x) {
            offsetRange[1] = middle
            continue
        }

        range.detach()
        return middle - 1
    }

    range.detach()
    return -1
}
