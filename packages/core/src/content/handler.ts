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
import { getTargetByPoint } from "../core"
import { TouchGesture } from '../utils/touch'

const scroll = {
    left: 0,
    top: 0,
}

const eventData = {
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

const explanation = {
    range: undefined as undefined | Range,
    visible: false,
}

const translation = {
    range: undefined as undefined | Range,
    visible: false,
}

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
            console.log('restoreScroll', scroll)
            window.scrollTo(scroll.left, scroll.top)
            break
        case MessageType.closeExplanation:
            explanation.visible = false
            break
        case MessageType.closeTranslation:
            translation.visible = false
            break
    }
}

export function handleMouseDown(e: MouseEvent) {
    eventData.mouseDown = {
        x: e.pageX,
        y: e.pageY,
        timeStamp: e.timeStamp,
    }
    eventData.timeStamp = e.timeStamp
}

export function handleMouseUp(e: MouseEvent) {
    eventData.mouseUp = {
        x: e.pageX,
        y: e.pageY,
        timeStamp: e.timeStamp,
    }
    eventData.timeStamp = e.timeStamp
}

export function handleClick(e: PointerEvent | MouseEvent) {
    eventData.click = {
        x: e.clientX,
        y: e.clientY,
        timeStamp: e.timeStamp,
    }
    eventData.timeStamp = e.timeStamp
    const click = clickFilter(e.timeStamp, eventData.mouseUp, eventData.mouseDown)
    const press = pressFilter(e.timeStamp, eventData.mouseUp, eventData.mouseDown)

    if (!click && !press) return

    const [allowLookup, allowTranslate, allowTapBlank] = actionFilter(e, ['lookup', 'translate', 'tapBlank'])
    console.log('action filter', allowLookup, allowTranslate, allowTapBlank)

    const target = getTargetByPoint(e.clientX, e.clientY)

    if (allowLookup && target && click) {
        const range = lookUp(target)
        explanation.range = range
        explanation.visible = true
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
    }

    if (allowTranslate && target && press) {
        const range = translate(target)
        translation.range = range
        translation.visible = true
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
    scroll.left = scrollX || scroll.left
    scroll.top = scrollY || scroll.top

    console.log('scroll', scroll)

    const { range: range1, visible: visible1 } = explanation
    const { range: range2, visible: visible2 } = translation

    if ((range1 && visible1) || (range2 && visible2)) {
        sendContentMessage({
            type: MessageType.rangeRect,
            ...(range1 ? { word: range1.getBoundingClientRect() } : {}),
            ...(range2 ? { sentence: range2.getBoundingClientRect() } : {}),
        })
    }
}

export function handleBeforeUnload(e: BeforeUnloadEvent) {
    const block = e.timeStamp - eventData.timeStamp < 300
    if (block) {
        e.preventDefault()
        e.returnValue = false
    }
}


export const touchGesture = new TouchGesture()

touchGesture.onSlip = (data) => {
    let target = getTargetByPoint(data.startX, data.startY)

    if (target) {
        const range = translate(target)
        translation.range = range
        translation.visible = true
        let selection = window.getSelection()
        if (!selection) return
        selection.removeAllRanges()
        selection.addRange(range)
    }
}