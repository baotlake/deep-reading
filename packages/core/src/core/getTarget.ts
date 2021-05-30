export default function getTargetByPoint(x, y): [Text, number] | false {
    let elements = document.elementsFromPoint(x, y)
    let targetList = []
    // find elments that has "Text" type children
    for (let i in elements) {
        if (!hasTextChild(elements[i])) continue
        if (elements[i].textContent.length === 0) continue
        targetList.push(elements[i])
    }

    console.log('targetList', targetList, elements)

    for (let e of targetList) {
        let targetOrFalse = pointTarget(e, x, y)
        if (targetOrFalse !== false) {
            return targetOrFalse
        }
    }
}

function hasTextChild(element: Element) {
    for (let i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeName === '#text') return true
    }
    return false
}

/** not suitable for mutli-level nesting */
function pointTarget(node: Node, x, y): [Text, number] | false {
    for (let i = 0; i < node.childNodes.length; i++) {
        let text = node.childNodes[i]
        if (text.nodeName === '#text') {
            console.log('#text', text, i)
            let offsetOrFalse = pointTextOffset(text as Text, x, y)
            if (offsetOrFalse !== false) return [text as Text, offsetOrFalse]
        }
    }

    return false
}

function pointTextOffset(target: Text, x, y): number | false {
    // not suitable for rotate Element
    return dichotomyFindPointTextOffset(target, x, y)
}

/**
 * 二分法查找
 * @param target
 * @param x
 * @param y
 */
function dichotomyFindPointTextOffset(target: Text, x, y) {
    let length = target.textContent.length
    let range = new Range()
    let offsetRange = [0, length]

    console.log('dichotomy find ...', offsetRange, x, y)

    let loopCount = 0

    while (offsetRange[1] - offsetRange[0] >= 1) {
        if (process.env.NODE_ENV !== 'production') {
            loopCount++
            if (loopCount > 300) {
                console.log('break loop')
                break
            }
        }

        let middle = Math.round((offsetRange[0] + offsetRange[1]) / 2)

        range.setStart(target, middle - 1)
        range.setEnd(target, middle)

        let position = range.getBoundingClientRect()

        console.log('position: ', loopCount, position)

        if (offsetRange[1] - offsetRange[0] === 1) {
            let margin = 2
            if (
                position.top < y + margin &&
                position.bottom > y - margin &&
                position.right > x - margin &&
                position.left < x + margin
            ) {
                return offsetRange[0]
            }
            return false
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

        return middle - 1
    }

    return false
}
