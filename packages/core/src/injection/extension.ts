import {extractSentenceRange, extractWordRange, getTargetByPoint,} from '../core'
import {actionFilter, clickFilter, lookUp, pressFilter, translate} from './utils'
import {elementPath} from "../utils/dom"

import {TouchGesture} from "./touch";
import {MessageData, PostMessageType} from "../types/message";
import {MessageType} from "../index"

let sendMessage: (message: MessageData) => void
let wordRange: Range
let sentenceRange: Range

function postMessage(message: MessageData) {
    // window.postMessage({...data, __KEY__: 'deep-reading'}, '*')
    sendMessage && sendMessage(message)
}

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

function handleMouseDown(e: MouseEvent) {
    mouseData.down = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
    }
}

function handleMouseUp(e: MouseEvent) {
    mouseData.up = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
    }
}

function handleClick(e: MouseEvent) {
    if (!clickFilter(mouseData.up, mouseData.down)) return

    const path: Element[] = elementPath(e.target as Element)
    if (!actionFilter(path, 'look-up')) return
    console.log('path -> ', path, e)

    let [x, y] = [e.clientX, e.clientY]
    let target = getTargetByPoint(x, y)

    if (target === false) {
        const messageData: MessageData = {
            type: PostMessageType.tapBlank
        }

        console.log('tapBlank MessageData ', messageData)
        postMessage(messageData)
    }

    if (target !== false) {
        wordRange = lookUp(postMessage, target)
    }
}

// 鼠标长按
function handlePress(e: MouseEvent) {
    if (!pressFilter(mouseData.up, mouseData.down)) return
    const path: Element[] = elementPath(e.target as Element)
    if (!actionFilter(path, 'translate')) return
    let [x, y] = [e.clientX, e.clientY]
    let target = getTargetByPoint(x, y)

    if (target !== false) {
        sentenceRange = translate(postMessage, target)
    }
}

type TouchData = Parameters<NonNullable<TouchGesture['onSlip']>>[0]

function handleSlip(data: TouchData) {
    let target = getTargetByPoint(data.startX, data.startY)

    if (target !== false) {
        sentenceRange = translate(postMessage, target)
    }
}

const touchGesture = new TouchGesture()
touchGesture.onSlip = handleSlip

window.addEventListener('mousedown', handleMouseDown)
window.addEventListener('mouseup', handleMouseUp)
window.addEventListener('click', handleClick)
window.addEventListener('click', handlePress)
touchGesture.bindListener()

function handleScroll(e: Event) {
    const messageData: MessageData = {
        type: PostMessageType.rangeRect,
        ...(wordRange ? {word: wordRange.getBoundingClientRect()} : {}),
        ...(sentenceRange ? {sentence: sentenceRange.getBoundingClientRect()} : {}),
    }
    postMessage(messageData)
}

window.addEventListener('scroll', handleScroll, true)

console.log('extension.js')

export function registerSendMessage(sendMessageFn: (message: MessageData) => void) {
    sendMessage = sendMessageFn
}
