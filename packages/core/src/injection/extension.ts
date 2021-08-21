import {
    getTargetByPoint,
    extractWordRange,
    extractSentenceRange,
} from '../core'
import {actionFilter} from './utils'
import {nodePath} from "../utils/dom"

import {TouchGesture} from "./touch";
import {
    PostMessageType,
    MessageData
} from "../types/message";
import {MessageType} from "../index";

let wordRange: Range

function handleClick(e: MouseEvent) {

    const path: Element[] = nodePath(e.target as Element)
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
        wordRange = extractWordRange(...target)

        const messageData: MessageData = {
            type: PostMessageType.lookUp,
            text: wordRange.toString(),
            position: wordRange.getBoundingClientRect(),
        }

        console.log('lookup messageData ', messageData)
        postMessage(messageData)

    }
}

type TouchData = Parameters<TouchGesture['onSlip']>[0]

function handleSlip(data: TouchData) {
    let target = getTargetByPoint(data.startX, data.startY)

    if (target !== false) {
        let sentenceRange = extractSentenceRange(...target)

        const messageData: MessageData = {
            type: MessageType.translate,
            text: sentenceRange.toString(),
            position: sentenceRange.getBoundingClientRect()
        }
        console.log('translate MessageData ', messageData)
        postMessage(messageData)
    }
}

const touchGesture = new TouchGesture()
touchGesture.onSlip = handleSlip

window.addEventListener('click', handleClick)
touchGesture.bindListener()

window.addEventListener('scroll', (e) => {
    if (wordRange) {
        const messageData: MessageData = {
            type: PostMessageType.lookUpPosition,
            position: wordRange.getBoundingClientRect(),
        }
        postMessage(messageData)
    }
})

console.log('extension.js')

function postMessage(data: unknown) {
    window.postMessage(data, '*')
}

