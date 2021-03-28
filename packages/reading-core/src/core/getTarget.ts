
function getTargetByPoint(x, y) {
    let elements = document.elementsFromPoint(x, y)
    let newList = []
    // find elments that has "Text" type children
    for (let i in elements) {
        if (!hasTextChild(elements[i])) continue
        // @ts-ignore
        if (elements[i].innerText.length <= 0) continue
        newList.push(elements[i])
    }

    let offset: number
    let target: Element
    for (let e of newList) {
        let offsetOrFalse = pointTextOffset(e, x, y)
        if (typeof offsetOrFalse === 'number') {
            offset = offsetOrFalse
            target = e
            break
        }
    }

    return [target, offset]
}

function hasTextChild(element: Element) {
    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].nodeType === 3) return true
    }
    return false
}

function pointTextOffset(target: Element, x, y) {
    // not suitable for rotate Element
    return dichotomyFindPointTextOffset(target, x, y)
}

/**
 * 二分法查找
 * @param target
 * @param x
 * @param y
 */
function dichotomyFindPointTextOffset(target: Element, x, y) {
    let length = 0
    // @ts-ignore
    if (target.innerText === undefined) {
        length = target.innerHTML.length
    } else {
        length = (target as HTMLElement).innerText.length
    }

    let range = new Range()
    let offsetRange = [0, length]

    while (offsetRange[1] - offsetRange[0] <= 1) {
        let middle = Math.round((offsetRange[0] + offsetRange[1]) / 2)
        range.setStart(target, middle)
        range.setEnd(target, middle + 1)

        let position = range.getBoundingClientRect()

        if (position.bottom < y) {
            offsetRange[1] = middle
            continue
        }

        if (position.top > y) {
            offsetRange[0] = middle
            continue
        }

        if (position.left > x) {
            offsetRange[0] = middle
            continue
        }

        if (position.right < x) {
            offsetRange[1] = middle
            continue
        }

        return middle
    }

    return false
}

export default getTargetByPoint
