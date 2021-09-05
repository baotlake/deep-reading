import {extractSentenceRange, extractWordRange, getTargetByPoint,} from '../core'

import {MessageData, PostMessageType, ReceiveMessageType,} from '../types/message'

import {TouchGesture} from './touch'
import {MessageType} from '..'

import {detectRefusedDisplay} from './detect'
import {summary} from './summary'
import {wordFilter, clickFilter, lookUp, pressFilter, translate} from "./utils"

let tempImpedeUnload = false
let scrollXY = [0, 0]
let wordRange: Range
let sentenceRange: Range
let postMessageTimestamp = Date.now()
const mouseData = {
    down: {
        x: 0,
        y: 0,
        time: 0,
    },
    up: {
        x: 0,
        y: 0,
        time: 0,
    }
}

window.addEventListener('message', (e: MessageEvent<MessageData>) => {
    switch (e.data.type) {
        case ReceiveMessageType.revertScroll:
            window.scrollTo(scrollXY[0], scrollXY[1])
            break
        // case
    }
})

window.addEventListener('mousedown', (e) => {
    mouseData.down = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
    }
})

window.addEventListener('mouseup', (e) => {
    mouseData.up = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
    }
})

window.addEventListener('click', (e) => {
    console.log('click')
    const click = clickFilter(mouseData.up, mouseData.down)
    const press = pressFilter(mouseData.up, mouseData.down)

    if (!click && !press) return

    tempImpedeUnload = true
    setTimeout(() => (tempImpedeUnload = false), 300)

    clickAnchor(e)

    let [x, y] = [e.clientX, e.clientY]
    let target = getTargetByPoint(x, y)

    console.log('target', target)

    if (target === false) {
        const messageData: MessageData = {
            type: PostMessageType.tapBlank,
        }
        postMessage(messageData)
    }

    if (target !== false && click) {
        wordRange = lookUp(postMessage, target)

        const selection = getSelection()
        selection?.removeAllRanges()
        selection?.addRange(wordRange)
    }

    if (target !== false && press) {
        sentenceRange = translate(postMessage, target)
        const selection = getSelection()
        selection?.removeAllRanges()
        selection?.addRange(sentenceRange)
    }
})

window.addEventListener('scroll', (e) => {
    if (window.scrollY !== 0 || window.scrollX !== 0) {
        scrollXY = [window.scrollX, window.scrollY]
    }

    const messageData: MessageData = {
        type: PostMessageType.rangeRect,
        ...(wordRange ? {word: wordRange.getBoundingClientRect()} : {}),
        ...(sentenceRange ? {sentence: sentenceRange.getBoundingClientRect()} : {}),
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
        break
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

        const messageData: MessageData = {
            type: PostMessageType.open,
            href: (target as HTMLAnchorElement).href,
        }

        postMessage(messageData)
    }
}

function postMessage(message: MessageData) {
    window.parent.postMessage(message, '*')
    postMessageTimestamp = Date.now()
}

const touchGesture = new TouchGesture()
touchGesture.bindListener()

touchGesture.onSlip = (data) => {
    console.log('onSlip', data)

    let target = getTargetByPoint(data.startX, data.startY)

    if (target !== false) {
        sentenceRange = extractSentenceRange(...target)
        let selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(sentenceRange)
        const messageData: MessageData = {
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
        const messageData: MessageData = {
            type: MessageType.refusedDisplay,
        }
        postMessage(messageData)
    }
}, 600)

setTimeout(() => {
    let sum = summary()
    const messageData: MessageData = {
        type: MessageType.summary,
        summary: sum,
    }
    console.log('📦', sum)
    postMessage(messageData)
}, 2000)

function heartbeat() {
    if (Date.now() - postMessageTimestamp > 1000 * 1.5) {
        postMessage({
            type: PostMessageType.heartbeat
        })
    }
    setTimeout(heartbeat, 1.5)
}

heartbeat()
