import {
    getTargetByPoint,
    extractWordRange,
    extractSentenceRange,
} from '../core'

import {
    PostMessageType,
    ReceiveMessageType,
    LookUpMessageData,
    OpenMessageData,
    MessageData,
    TapBlankMessageData,
    TranlateMessageData,
    RefusedDisplayMessageData,
    SummaryMessageData,
} from './type'

import { TouchGesture } from './touch'
import { MessageType } from '..'

import { detectRefusedDisplay } from './detect'
import { summary } from './summary'

let tempImpedeUnload = false
let scrollXY = [0, 0]
let wordRange: Range

window.addEventListener('message', (e: MessageEvent<MessageData>) => {
    switch (e.data.type) {
        case ReceiveMessageType.revertScroll:
            window.scrollTo(scrollXY[0], scrollXY[1])
            break
    }
})

window.addEventListener('click', (e) => {
    console.log('click')

    tempImpedeUnload = true
    setTimeout(() => (tempImpedeUnload = false), 300)

    clickAnchor(e)

    let [x, y] = [e.clientX, e.clientY]
    let target = getTargetByPoint(x, y)

    console.log('target', target)

    if (target === false) {
        const messageData: TapBlankMessageData = {
            type: PostMessageType.tapBlank,
        }
        postMessage(messageData)
    }

    if (target !== false) {
        wordRange = extractWordRange(...target)
        console.log(`%c${wordRange.toString()}`, 'color: red;')

        let selection = getSelection()
        selection?.removeAllRanges()
        selection?.addRange(wordRange)

        const messageData: LookUpMessageData = {
            type: PostMessageType.lookUp,
            text: wordRange.toString(),
            position: wordRange.getBoundingClientRect(),
        }

        postMessage(messageData)
    }
})

window.addEventListener('scroll', (e) => {
    if (window.scrollY !== 0 || window.scrollX !== 0) {
        scrollXY = [window.scrollX, window.scrollY]
    }

    if (!wordRange) return
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

        if (/^#/.test(href)) {
            window.location.hash = href
            return
        }

        console.log('click anchor: ', href, (target as HTMLAnchorElement).href)

        const messageData: OpenMessageData = {
            type: PostMessageType.open,
            href: (target as HTMLAnchorElement).href,
        }

        postMessage(messageData)
    }
}

function postMessage(message: MessageData) {
    window.parent.postMessage(message, '*')
}

const touchGesture = new TouchGesture()
touchGesture.bindListener()

touchGesture.onSlip = (data) => {
    console.log('onSlip', data)

    let target = getTargetByPoint(data.startX, data.startY)

    if (target !== false) {
        let sentenceRange = extractSentenceRange(...target)
        let selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(sentenceRange)
        const messageData: TranlateMessageData = {
            type: MessageType.translate,
            text: sentenceRange.toString(),
            position: sentenceRange.getBoundingClientRect(),
        }
        postMessage(messageData)
    }
}

// ---------

setTimeout(() => {
    let isRefusedDisplay = detectRefusedDisplay()
    // console.log('isRefused: ', isRefusedDisplay ? '✅' : '❎')

    if (isRefusedDisplay) {
        const messageData: RefusedDisplayMessageData = {
            type: MessageType.refusedDisplay,
        }
        postMessage(messageData)
    }
}, 600)

setTimeout(() => {
    let sum = summary()
    const messageData: SummaryMessageData = {
        type: MessageType.summary,
        summary: sum,
    }
    console.log('📦', sum)
    postMessage(messageData)
}, 2000)
