import { getTargetByPoint, extractWordRange } from '../core'

import {
    PostMessageType,
    LookUpMessageData,
    OpenMessageData,
    MessageData,
} from './type'

let tempImpedeUnload = false

window.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'A':
            break
    }
})

let wordRange: Range

window.addEventListener('click', (e) => {
    console.log('click')

    tempImpedeUnload = true
    setTimeout(() => (tempImpedeUnload = false), 300)

    clickAnchor(e)

    let [x, y] = [e.clientX, e.clientY]
    let target = getTargetByPoint(x, y)

    let selection = getSelection()

    wordRange = extractWordRange(target[0], target[1])
    console.log(`%c${wordRange.toString()}`, 'color: red;')

    selection?.removeAllRanges()
    selection?.addRange(wordRange)

    const messageData: LookUpMessageData = {
        type: PostMessageType.lookUp,
        text: wordRange.toString(),
        position: wordRange.getBoundingClientRect(),
    }

    postMessage(messageData)
})

let scrollCount = 0
window.addEventListener('scroll', (e) => {
    scrollCount += 1

    if (scrollCount % 20 === 0) console.log('scroll')
    // console.log('scroll: ', e)
    let messageData: MessageData = {
        type: PostMessageType.lookUpPosition,
        position: wordRange.getBoundingClientRect(),
    }
    postMessage(messageData)
})

window.addEventListener('beforeunload', (e) => {
    if (!tempImpedeUnload) return

    e.preventDefault()
    e.returnValue = false
})

function clickAnchor(e: MouseEvent) {
    let target = e.target as Element

    while (target.nodeName !== 'BODY') {
        if (target.nodeName === 'A') {
            break
        }

        if (target.parentElement) {
            target = target.parentElement
        }
    }

    if (target.nodeName === 'A') {
        let href = target.getAttribute('href') || ''

        if (/^(mailto:)|(tel:)/.test(href)) return

        e.preventDefault()
        e.stopPropagation()

        if (/^#/) {
            window.location.hash = href
            return
        }

        console.log('click anchor: ', href)

        const messageData: OpenMessageData = {
            type: PostMessageType.open,
            href: <URL>(<unknown>href),
        }

        postMessage(messageData)
    }
}

function postMessage(message: MessageData) {
    window.parent.postMessage(message, '*')
}
