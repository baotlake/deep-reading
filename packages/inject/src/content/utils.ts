// import { MessageData, MessageType } from "../types/message"
// import { extractSentenceRange, extractWordRange } from "../core"
import { sendContentMessage } from './message'
// import { detectRefusedDisplay } from "../core/detect"
// import { abstract } from "../core/summary"

import {
    MessageData,
    MessageType,
    extractSentenceRange,
    extractWordRange,
    detectRefusedDisplay,
    abstract,
    TriggerMode,
    isArticleContent,
} from '@wrp/core'


type Action = 'lookup' | 'translate' | 'tapBlank'

type ComposedPath = NonNullable<Event['target']>[]

function actionFilter(path: ComposedPath, action: Action): boolean {
    const target = path[0]
    switch (target instanceof Element && target.nodeName) {
        case 'INPUT':
            return false
    }

    for (let node of path) {
        if (!(node instanceof Element)) continue
        const policy = node.getAttribute('data-wrp-action') || ''
        if (!policy) continue
        if (policy.search('no-' + action) !== -1) {
            return false
        }
        if (policy.search(action) !== -1) {
            return true
        }
    }
    return true
}

function coverModeFilter(path: ComposedPath) {

    let count = 0
    for (let target of path) {
        count++
        if (!(target instanceof Element)) continue
        if (target.getAttribute('data-wrp-cover')) return true
        if (count > 5) break
    }

    return false
}

function modeFilter(path: ComposedPath, mode: TriggerMode): boolean {
    switch (mode) {
        case 'all':
            return true
        case 'article':
            return isArticleContent(path)
        case 'cover':
            return coverModeFilter(path)
        default:
            return false
    }
}

export function eventFilter(e: Event, actions: Action[], mode: TriggerMode = 'all'): boolean[] {
    const path = e.composedPath()
    console.debug('event filter path', path)
    const modePass = modeFilter(path, mode)
    const modeMask = actions.map((action) => modePass || action === 'tapBlank')

    const values = actions.map((item) => actionFilter(path, item))
    return values.map((value, i) => value && modeMask[i])
}

export function wordFilter(word: string) {
    word = word.trim()
    if (word.length < 1) return false
    // 不含有字母数字 not contains numbers or letters
    if (!/\w/.test(word)) return false
    return true
}

interface MouseData {
    x: number,
    y: number,
    timeStamp: number,
}

export function isClick(timeStamp: number, up: MouseData, down: MouseData) {
    const mouseClick = timeStamp - up.timeStamp < 5
    const shortClick = up.timeStamp - down.timeStamp < 300
    const noMove = Math.max(Math.abs(up.x - down.x), Math.abs(up.y - down.y)) < 3

    if (mouseClick) {
        return shortClick && noMove
    }
    return true
}

export function isPress(timeStamp: number, up: MouseData, down: MouseData) {
    const mouseClick = timeStamp - up.timeStamp < 5
    const press = up.timeStamp - down.timeStamp >= 300 && up.timeStamp - down.timeStamp < 1000
    const noMove = Math.hypot(up.x - down.x, up.y - down.y) < 3

    if (mouseClick) {
        return press && noMove
    }
    console.log('press noMove', press, noMove)
    return false
}

export function lookUp(target: [Text, number]) {
    let wordRange = extractWordRange(...target)
    let text = wordRange.toString()

    if (wordFilter(text)) {
        const messageData: MessageData = {
            type: 'lookUp',
            text: text,
            position: wordRange.getBoundingClientRect(),
        }
        sendContentMessage(messageData)
    }
    return wordRange
}

export function translate(target: [Text, number]) {
    let sentenceRange = extractSentenceRange(...target)
    const messageData: MessageData = {
        type: 'translate',
        text: sentenceRange.toString(),
        position: sentenceRange.getBoundingClientRect(),
    }
    sendContentMessage(messageData)

    return sentenceRange
}

export function detectRefused() {
    const refused = detectRefusedDisplay()

    refused && sendContentMessage({
        type: 'refusedDisplay'
    })
}

export function abstractProfile() {
    const summary = abstract()
    sendContentMessage({
        type: 'summary',
        summary: summary,
    })
}