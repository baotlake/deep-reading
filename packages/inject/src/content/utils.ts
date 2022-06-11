import { sendContentMessage } from './message'

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
        case 'main':
            return isArticleContent(path)
        // case 'cover':
        //     return coverModeFilter(path)
        case 'disable':
        default:
            return false
    }
}

export function eventFilter(e: Event, actions: Action[], mode: TriggerMode = 'all'): boolean[] {
    const path = e.composedPath()
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

export function findLink(target: HTMLElement | Text): HTMLAnchorElement | null {
    let current = target
    let link: HTMLAnchorElement | null = null

    while (current.nodeName !== 'BODY') {
        const href = current instanceof HTMLElement && current.getAttribute('href')
        if (href && current instanceof HTMLAnchorElement) {
            link = current
            break
        }

        if (current.parentElement) {
            current = current.parentElement
            continue
        }

        break
    }

    return link
}

export function clickLink(target: HTMLAnchorElement) {
    const href = target.getAttribute('href')
    if (href) {
        if (/^#/.test(href)) {
            // window.location.hash = href
            const hash = href.trim().slice(1)
            const element = document.querySelector('#' + hash + ',[name="' + hash + '"]')
            element && element.scrollIntoView()
            return
        }

        const url = target.href
        const title = target.textContent || target.title || ''

        if (/https?:\/\//.test(url)) {
            sendContentMessage<MessageData>({
                type: 'open',
                payload: {
                    url: url,
                    title: title,
                }
            })
        }
    }
}