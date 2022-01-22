import { sendContentMessage } from './message'
import { MessageType, MessageData } from "../types/message"
import {
    pressFilter,
    clickFilter,
    lookUp,
    translate,
    detectRefused,
    abstractProfile,
    actionFilter,
} from './utils'
import { getTargetByPoint, extractSentenceRange } from "../core"
import { TouchGesture } from '../utils/touch'


let [scrollLeft, scrollTop] = [0, 0]
const eventLog = {
    click: {
        x: 0,
        y: 0,
        timeStamp: 0,
    },
    mouseDown: {
        x: 0,
        y: 0,
        timeStamp: 0,
    },
    mouseUp: {
        x: 0,
        y: 0,
        timeStamp: 0,
    },
    timeStamp: 0,
}
let wordRange: Range
let sentenceRange: Range


export function handleReadyStateChange(e: Event) {
    sendContentMessage({
        type: MessageType.readyStateChange,
        state: document.readyState,
    })

    if (document.readyState === 'complete') {
        detectRefused()
        abstractProfile()
    }
}

export function handleMessage(e: MessageEvent<MessageData>) {
    const message = e.data
    switch (message.type) {
        case MessageType.restoreScroll:
            scrollLeft && scrollTop && window.scrollTo(scrollLeft, scrollTop)
            break
    }
}

export function handleMouseDown(e: MouseEvent) {
    eventLog.mouseDown = {
        x: e.pageX,
        y: e.pageY,
        timeStamp: e.timeStamp,
    }
    eventLog.timeStamp = e.timeStamp
}

export function handleMouseUp(e: MouseEvent) {
    eventLog.mouseUp = {
        x: e.pageX,
        y: e.pageY,
        timeStamp: e.timeStamp,
    }
    eventLog.timeStamp = e.timeStamp
}

export function handleClick(e: PointerEvent | MouseEvent) {
    eventLog.click = {
        x: e.clientX,
        y: e.clientY,
        timeStamp: e.timeStamp,
    }
    eventLog.timeStamp = e.timeStamp
    const click = clickFilter(e.timeStamp, eventLog.mouseUp, eventLog.mouseDown)
    const press = pressFilter(e.timeStamp, eventLog.mouseUp, eventLog.mouseDown)

    if (!click && !press) return

    const [allowLookup, allowTranslate, allowTapBlank] = actionFilter(e, ['lookup', 'translate', 'tapBlank'])
    console.log('action filter', allowLookup, allowTranslate, allowTapBlank)

    const target = getTargetByPoint(e.clientX, e.clientY)

    if (allowLookup && target && click) {
        wordRange = lookUp(target)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(wordRange)
    }

    if (allowTranslate && target && press) {
        sentenceRange = translate(target)
        // const selection = window.getSelection()
        // selection?.removeAllRanges()
        // selection?.addRange(sentenceRange)
    }

    if (!target && allowTapBlank && click) {
        sendContentMessage({
            type: MessageType.tapBlank
        })
    }
}

export function handleClickAnchor(e: PointerEvent | MouseEvent) {
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
            type: MessageType.open,
            href: (target as HTMLAnchorElement).href,
        }

        sendContentMessage(messageData)
    }
}

export function handleScroll(e: Event) {
    const { scrollX, scrollY } = window
    scrollLeft = scrollX
    scrollTop = scrollY

    if (wordRange || sentenceRange) {
        sendContentMessage({
            type: MessageType.rangeRect,
            ...(wordRange ? { word: wordRange.getBoundingClientRect() } : {}),
            ...(sentenceRange ? { sentence: sentenceRange.getBoundingClientRect() } : {}),
        })
    }
}

export function handleBeforeUnload(e: BeforeUnloadEvent) {
    const block = e.timeStamp - eventLog.timeStamp < 300
    if (block) {
        e.preventDefault()
        e.returnValue = false
    }
}


export const touchGesture = new TouchGesture()

touchGesture.onSlip = (data) => {
    let target = getTargetByPoint(data.startX, data.startY)

    if (target) {
        sentenceRange = extractSentenceRange(...target)
        let selection = window.getSelection()
        if (!selection) return
        selection.removeAllRanges()
        selection.addRange(sentenceRange)
        const messageData: MessageData = {
            type: MessageType.translate,
            text: sentenceRange.toString(),
            position: sentenceRange.getBoundingClientRect(),
        }

        sendContentMessage(messageData)
    }
}