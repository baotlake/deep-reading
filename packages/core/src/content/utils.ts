import { MessageData, MessageType } from "../types/message"
import { extractSentenceRange, extractWordRange } from "../core"
import { sendContentMessage } from './message'
import { detectRefusedDisplay } from "./detect"
import { abstract } from "./summary"

type Action = 'lookup' | 'translate' | 'tapBlank'

function pathFilter(path: Element[], action: Action): boolean {
    for (let node of path) {
        if (!node.attributes) continue
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

export function actionFilter(e: Event, action: Action[]): boolean[] {
    const path = e.composedPath() as Element[]
    console.debug('action filter path', path)
    return action.map((item) => pathFilter(path, item))
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

export function clickFilter(timeStamp: number, up: MouseData, down: MouseData) {
    const mouseClick = timeStamp - up.timeStamp < 5
    const shortClick = up.timeStamp - down.timeStamp < 200
    const noMove = Math.max(Math.abs(up.x - down.x), Math.abs(up.y - down.y)) < 2

    if (mouseClick) {
        return shortClick && noMove
    }
    return true
}

export function pressFilter(timeStamp: number, up: MouseData, down: MouseData) {
    const mouseClick = timeStamp - up.timeStamp < 5
    const press = up.timeStamp - down.timeStamp >= 200 && up.timeStamp - down.timeStamp < 900
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
            type: MessageType.lookUp,
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
        type: MessageType.translate,
        text: sentenceRange.toString(),
        position: sentenceRange.getBoundingClientRect(),
    }
    sendContentMessage(messageData)

    return sentenceRange
}

export function detectRefused() {
    const refused = detectRefusedDisplay()

    refused && sendContentMessage({
        type: MessageType.refusedDisplay
    })
}

export function abstractProfile() {
    const summary = abstract()
    sendContentMessage({
        type: MessageType.summary,
        summary: summary,
    })
}