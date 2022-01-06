

export function elementPath(target: Element) {
    const path = []
    while (target) {
        path.push(target)
        target = target.parentElement
    }
    return path
}

export function isInline(target: Node) {
    if (process.env.NODE_ENV !== 'production') {
        if (!target) {
            console.error('isInline(target: Node) target: ', target)
            return false
        }
    }

    if (target.nodeName === '#text') return true
    if (target.nodeName === '#comment') return true
    if (['TEXT', 'TSPAN'].includes(target.nodeName)) return true
    if (['svg', 'IFRAME', 'HTML', 'BR', 'HR'].includes(target.nodeName)) return false

    let display = window.getComputedStyle(target as Element).display
    if (display.startsWith('inline')) return true
    return false
}


/** 查找下一个叶子结点，以及和下一个叶子结点之间的关系(是否inline) */
export function nextLeafNode(currentNode: Node, type: 'start' | 'end'): [Node | null, boolean] {
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


/** 查找下一个或上一个Text结点, 并判断是否是inline关系 */
export function nextText(node: Node, type: 'start' | 'end'): [Text | null, boolean] {
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

    return nextData as [Text, boolean]
}
