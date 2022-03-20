import { sendContentMessage } from './message'
import {
    MessageType,
    MessageData,
    getTargetByPoint,
    TouchGesture,
} from "@wrp/core"
import {
    isPress,
    isClick,
    lookUp,
    translate,
    detectRefused,
    abstractProfile,
    eventFilter,
} from './utils'
import { mode, setMode } from './mode'

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
    sendContentMessage<MessageData>({
        type: 'readyStateChange',
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
        case 'restoreScroll':
            console.log('restoreScroll', scroll)
            window.scrollTo(scroll.left, scroll.top)
            break

    }
}

export function handleContentMessage(data: MessageData) {
    switch (data.type) {
        case 'componentsVisibleChange':
            explanation.visible = data.payload.explanation
            translation.visible = data.payload.translation
            break
        case 'setTriggerMode':
            setMode(data.payload.mode)
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
    console.log('content handleClick', e)
    eventData.click = {
        x: e.clientX,
        y: e.clientY,
        timeStamp: e.timeStamp,
    }
    eventData.timeStamp = e.timeStamp
    const click = isClick(e.timeStamp, eventData.mouseUp, eventData.mouseDown)
    const press = isPress(e.timeStamp, eventData.mouseUp, eventData.mouseDown)

    if (!click && !press) return

    const [allowLookup, allowTranslate, allowTapBlank] = eventFilter(e, ['lookup', 'translate', 'tapBlank'], mode)
    console.log('action filter', allowLookup, allowTranslate, allowTapBlank)
    console.log('click,  press', click, press)

    const target = getTargetByPoint(e.clientX, e.clientY)

    if (allowLookup && target && click) {
        const range = lookUp(target)
        explanation.range = range
        // const selection = window.getSelection()
        // selection?.removeAllRanges()
        // selection?.addRange(range)
    }

    if (allowTranslate && target && press) {
        const range = translate(target)
        translation.range = range
        // const selection = window.getSelection()
        // selection?.removeAllRanges()
        // selection?.addRange(sentenceRange)
    }

    if (!target && allowTapBlank && click) {
        sendContentMessage<MessageData>({
            type: 'tapBlank'
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
            // window.location.hash = href
            const hash = href.trim().slice(1)
            const element = document.querySelector('#' + hash + ',[name="' + hash + '"]')
            element && element.scrollIntoView()

            console.log('# hash link', href, element)
            return
        }

        console.log('click anchor: ', href, (target as HTMLAnchorElement).href)

        const messageData: MessageData = {
            type: 'open',
            href: (target as HTMLAnchorElement).href,
        }

        sendContentMessage(messageData)
    }
}

function sendRangeRect() {
    const { range: range1, visible: visible1 } = explanation
    const { range: range2, visible: visible2 } = translation

    if ((range1 && visible1) || (range2 && visible2)) {
        sendContentMessage({
            type: 'rangeRect',
            ...(range1 ? { word: range1.getBoundingClientRect() } : {}),
            ...(range2 ? { sentence: range2.getBoundingClientRect() } : {}),
        })
    }
}

export function handleScroll(e: Event) {
    const { scrollX, scrollY } = window
    scroll.left = scrollX || scroll.left
    scroll.top = scrollY || scroll.top

    // console.log('scroll', scroll)
    sendRangeRect()
}

export function handleTouchMove(e: Event) {
    sendRangeRect()
}

export function handleBeforeUnload(e: BeforeUnloadEvent) {
    const block = e.timeStamp - eventData.timeStamp < 300
    // const noAction = eventData.timeStamp === 0
    if (block) {
        e.preventDefault()
        e.returnValue = false
    }
}


export const touchGesture = new TouchGesture()

const touchData = {
    startPass: false,
}

touchGesture.onStart = (data) => {
    const event = data?.nativeEvent
    const [allowTranslate] = event ? eventFilter(event, ['translate'], mode) : [false]
    touchData.startPass = allowTranslate
    console.log('touchGesture.onStart', allowTranslate)
}

touchGesture.onSlip = (data) => {
    if (!touchData.startPass) return

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


export function handleDOMContentLoaded(e: Event) {
    sendContentMessage<MessageData>({
        type: 'DOMContentLoaded'
    })
}

export function handleLoad(e: Event) {
    sendContentMessage<MessageData>({
        type: 'load'
    })
}
