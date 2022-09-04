import { sendContentMessage } from './message'
import {
    MessageType,
    MessageData,
    getTarget,
    getTargetByPoint,
    TouchGesture,
    extractWordRange,
    getCoparent,
    extractSentenceRange,
} from "@wrp/core"
import {
    isPress,
    isClick,
    detectRefused,
    abstractProfile,
    eventFilter,
    findLink,
    clickLink,
    proxyFaild,
    markRange,
    wordFilter,
    client2pageRect,
    tracePosition,
} from './utils'
import { options } from './options'
import { debounce } from 'lodash-es'

const scroll = {
    y: 0,
    x: 0,
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

const markPref = 'dr-highlight-'

const explanation = {
    trace: false,
    marker: null as null | any,
    markerId: 0,

    rangeStart: null as null | [Node, number],
    rangeEnd: null as null | [Node, number],
    element: null as null | Element,

    initialRangeRect: null as null | DOMRect,
    initialElementRect: null as null | DOMRect,

    range: undefined as undefined | Range,
}

const translation = {
    trace: false,
    marker: null as null | any,
    markerId: 0,

    rangeStart: null as null | [Node, number],
    rangeEnd: null as null | [Node, number],
    element: null as null | Element,

    initialRangeRect: null as null | DOMRect,
    initialElementRect: null as null | DOMRect,

    range: undefined as undefined | Range,
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
            const top = message?.payload?.scrollY ?? scroll.y
            const left = message?.payload?.scrollX ?? scroll.x
            console.log('restoreScroll', top, left)
            window.scrollTo(left, top)
            break
        case 'fallbackLoadError':
            proxyFaild(message)
            break
    }
}

export function handleContentMessage(data: MessageData) {
    switch (data.type) {
        case 'setTriggerMode':
            options.triggerMode = data.payload.mode
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


async function lookup(target: [Text, number]) {
    const range = extractWordRange(...target)
    const text = range.toString()
    if (!wordFilter(text)) return

    const rangeRect = client2pageRect(range.getBoundingClientRect())
    const coparent = getCoparent(range.startContainer, range.endContainer)

    if (!coparent) return

    explanation.element = coparent
    explanation.initialRangeRect = rangeRect
    explanation.initialElementRect = client2pageRect(coparent.getBoundingClientRect())

    sendContentMessage<MessageData>({
        type: 'lookUp',
        text: text,
        position: rangeRect,
    })

    const { marker, markerId } = explanation
    explanation.marker = markRange(range, { className: markPref + ++explanation.markerId })
    if (marker) marker.unmark({ className: markPref + markerId })

    range.detach()
}

async function translate(target: [Text, number]) {
    const range = extractSentenceRange(...target)
    const text = range.toString()
    // sentenceFilter(text)

    const rangeRect = client2pageRect(range.getBoundingClientRect())
    const coparent = getCoparent(range.startContainer, range.endContainer)
    if (!coparent) return

    translation.element = coparent
    translation.initialRangeRect = rangeRect
    translation.initialElementRect = client2pageRect(coparent.getBoundingClientRect())

    sendContentMessage<MessageData>({
        type: 'translate',
        text: text,
        position: rangeRect,
    })

    const { marker, markerId } = translation
    translation.marker = markRange(range, { className: markPref + ++translation.markerId })
    if (marker) marker.unmark({ className: markPref + markerId })

    range.detach()
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
    const [allowLookup, allowTranslate, allowTapBlank] = eventFilter(
        e,
        ['lookup', 'translate', 'tapBlank'],
        options.triggerMode
    )

    // const target = getTargetByPoint(e.clientX, e.clientY)
    const target = getTarget(e.clientX, e.clientY)


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
        if (isNomarlLink && link.contains(e.target as Node) && options.preventClickLink) {
            console.log('prevent click link', options.preventClickLink)
            e.preventDefault()
        }

        linkData.link = link
        clickLink(link)
    }

    if (!click && !press) return
    if (!target) return

    if (allowLookup && click) {
        lookup(target)
    }

    if (allowTranslate && press) {
        translate(target)
    }
}

export function dispatchClickLink() {
    linkData.link && linkData.link.click()
    console.log('click link', linkData)
}

export function setComponentsVisible(explanationVisible: boolean, translateVisible: boolean) {
    explanation.trace = explanationVisible
    translation.trace = translateVisible

    if (!explanationVisible) {
        const { marker, markerId } = explanation
        setTimeout(() => {
            marker && marker.unmark({ className: markPref + markerId })
        }, 300)
        explanation.marker = null
    }

    if (!translateVisible) {
        const { marker, markerId } = translation
        setTimeout(() => {
            marker && marker.unmark({ className: markPref + markerId })
        }, 300)
        translation.marker = null
    }
}

function sendTargetPosition() {
    const {
        element: element1,
        trace: trace1,
        initialElementRect: oldRect1,
        initialRangeRect: oldRangeRect1,
    } = explanation
    const {
        element: element2,
        trace: trace2,
        initialElementRect: oldRect2,
        initialRangeRect: oldRangeRect2,
    } = translation

    const wordPosition = trace1 && element1 && oldRect1 && oldRangeRect1
        ? tracePosition(element1, oldRect1, oldRangeRect1) : null

    const sentencePosition = (trace2 && element2 && oldRect2 && oldRangeRect2)
        ? tracePosition(element2, oldRect2, oldRangeRect2) : null

    if (trace1 || trace2) {
        sendContentMessage<MessageData>({
            type: 'targetPosition',
            payload: {
                word: wordPosition,
                sentence: sentencePosition,
            }
        })
    }
}

const debouncedReportScroll = debounce(() => {
    sendContentMessage<MessageData>({
        type: 'scroll',
        payload: {
            scrollX: scroll.x,
            scrollY: scroll.y
        }
    })
}, 600)

export function handleScroll(e: Event) {
    const { scrollX, scrollY } = window
    scroll.x = scrollX || scroll.x
    scroll.y = scrollY || scroll.y

    // console.log('scroll', scroll)
    sendTargetPosition()
    debouncedReportScroll()
}

export function handleTouchMove(e: Event) {
    sendTargetPosition()
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
let startSlipTouch = false

touchGesture.onStart = (data) => {
    const event = data.nativeEvent
    const [allowTranslate] = eventFilter(event, ['translate'], options.triggerMode)
    startSlipTouch = allowTranslate
    console.log('touchGesture.onStart', allowTranslate)
}

touchGesture.onSlip = (data) => {
    if (!startSlipTouch) return

    let target = getTargetByPoint(data.startX, data.startY)
    if (target) {
        translate(target)
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