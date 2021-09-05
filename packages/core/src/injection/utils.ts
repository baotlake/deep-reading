import {MessageData, PostMessageType} from "../types/message";
import {extractSentenceRange, extractWordRange} from "../core";
import {MessageType} from "../index";

type Action = 'look-up' | 'translate'

export function actionFilter(path: Element[], action: Action) {
    for (let node of path) {
        if (!node.attributes) continue
        let policy = node.getAttribute('wrp-action') || ''
        if (policy.search(`no-${action}`) !== -1) {
            return false
        }
        if (policy.search(action) !== -1) {
            return true
        }
    }
    return true
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
    time: number,
}

export function clickFilter(up: MouseData, down: MouseData) {
    const now = Date.now()
    const mouseClick = now - up.time < 5
    const shortClick = up.time - down.time < 300
    const noMove = Math.max(Math.abs(up.x - down.x), Math.abs(up.y - down.y)) < 2

    if (mouseClick) {
        return shortClick && noMove
    }
    return true
}

export function pressFilter(up: MouseData, down: MouseData) {
    const now = Date.now()
    const mouseClick = now - up.time < 5
    const press = up.time - down.time >= 300 && up.time - down.time < 900
    const noMove = Math.max(Math.abs(up.x - down.x), Math.abs(up.y - down.y)) < 2

    if (mouseClick) {
        return press && noMove
    }
    return false
}

export function lookUp(postMessage: (data: MessageData) => void, target: [Text, number]) {
    let wordRange = extractWordRange(...target)
    let text = wordRange.toString()

    if (wordFilter(text)) {
        const messageData: MessageData = {
            type: PostMessageType.lookUp,
            text: text,
            position: wordRange.getBoundingClientRect(),
        }
        postMessage(messageData)
    }
    return wordRange
}

export function translate(postMessage: (data: MessageData) => void, target: [Text, number]) {
    let sentenceRange = extractSentenceRange(...target)
    const messageData: MessageData = {
        type: MessageType.translate,
        text: sentenceRange.toString(),
        position: sentenceRange.getBoundingClientRect(),
    }
    postMessage(messageData)

    return sentenceRange
}
