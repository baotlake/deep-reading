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
    findLink,
    clickLink,
    proxyFaild,
} from './utils'
import { triggerMode, config, preventClickLink } from './config'

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

const linkData = {
    link: null as HTMLElement | null
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
        case 'fallbackLoadError':
            proxyFaild(message)
            break
    }
}

export function handleContentMessage(data: MessageData) {
    switch (data.type) {
        case 'setTriggerMode':
            config.triggerMode = data.payload.mode
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
    const [allowLookup, allowTranslate, allowTapBlank] = eventFilter(e, ['lookup', 'translate', 'tapBlank'], triggerMode)

    const target = getTargetByPoint(e.clientX, e.clientY)

    if (!target && allowTapBlank && click) {
        sendContentMessage<MessageData>({
            type: 'tapBlank'
        })
    }

    let link = findLink(e.target as HTMLElement)
    if (!link && target) link = findLink(target[0])

    if (link) {
        const href = link.getAttribute('href')
        const isNomarlLink = href && !/^mailto:|^tel:/.test(href)
        if (isNomarlLink && link.contains(e.target as Node) && preventClickLink) {
            console.log('prevent click link', preventClickLink)
            e.preventDefault()
        }

        linkData.link = link
        clickLink(link)
    }

    if (!click && !press) return
    if (!target) return

    if (allowLookup && click) {
        const range = lookUp(target)
        explanation.range = range
        // const selection = window.getSelection()
        // selection?.removeAllRanges()
        // selection?.addRange(range)
    }

    if (allowTranslate && press) {
        const range = translate(target)
        translation.range = range
        // const selection = window.getSelection()
        // selection?.removeAllRanges()
        // selection?.addRange(sentenceRange)
    }
}

export function dispatchClickLink() {
    linkData.link && linkData.link.click()
    console.log('click link', linkData)
}

export function setComponentsVisible(explanationVisible: boolean, translateVisible: boolean) {
    explanation.visible = explanationVisible
    translation.visible = translateVisible
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
    const [allowTranslate] = event ? eventFilter(event, ['translate'], triggerMode) : [false]
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

export function handleError(e: ErrorEvent | Event) {
    console.warn('error a', e)

    const target = e.target
    if (!(target instanceof HTMLElement)) return
    if (!e.isTrusted) return

    if (target instanceof HTMLLinkElement) {
        sendContentMessage<MessageData>({
            type: 'loadError',
            payload: {
                name: 'link',
                rel: target.rel,
                href: target.attributes.getNamedItem('href')?.value + '',
                url: target.href,
            }
        })
    }
}