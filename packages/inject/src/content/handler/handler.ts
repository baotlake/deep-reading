import { sendContentMessage } from '../message'
import {
    MessageType,
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
    eventFilter,
    findLink,
    clickLink,
    proxyFaild,
    markRange,
    wordFilter,
    client2pageRect,
    tracePosition,
} from '../utils'
import { options } from '../options'
import { debounce } from 'lodash-es'
import { Marker } from '../Marker'
import { InjectMessage } from '../../type'

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

const markPreffix = 'dr-highlight-'

type Mark = [null | any, number]

const explanation = {
    trace: false,
    marker: new Marker(markPreffix),

    rangeStart: null as null | [Node, number],
    rangeEnd: null as null | [Node, number],
    element: null as null | Element,

    initialRangeRect: null as null | DOMRect,
    initialElementRect: null as null | DOMRect,

    range: undefined as undefined | Range,
}

const translation = {
    trace: false,
    marker: new Marker(markPreffix),

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

export function handleMessage(e: MessageEvent<InjectMessage>) {
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

export function handleContentMessage(data: InjectMessage) {
    switch (data.type) {
        case 'setTargetType':
            options.targetType = data.payload.type
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

    sendContentMessage<InjectMessage>({
        type: 'tapWord',
        payload: {
            text,
            position: rangeRect,
            element: coparent,
        }
    })

    explanation.marker?.highlight(range)
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

    sendContentMessage<InjectMessage>({
        type: 'translate',
        text: text,
        position: rangeRect,
    })

    translation.marker?.highlight(range)

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
        options.targetType
    )

    if (!allowLookup && !allowTranslate && !allowTapBlank) return

    // const target = getTargetByPoint(e.clientX, e.clientY)
    const target = getTarget(e.clientX, e.clientY)


    if (!target && allowTapBlank && click) {
        sendContentMessage<InjectMessage>({
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

export function componentsVisibleChange(explanationVisible: boolean, translateVisible: boolean) {
    explanation.trace = explanationVisible
    translation.trace = translateVisible

    console.log('component visible', explanationVisible, translateVisible)

    if (explanationVisible) {
        explanation.marker?.cancelDelay()
    }
    if (translateVisible) {
        translation.marker?.cancelDelay()
    }

    if (!explanationVisible) {
        explanation.marker?.delayUnmark()
    }

    if (!translateVisible) {
        translation.marker?.delayUnmark()
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
        sendContentMessage<InjectMessage>({
            type: 'targetPosition',
            payload: {
                word: wordPosition,
                sentence: sentencePosition,
            }
        })
    }
}

const debouncedReportScroll = debounce(() => {
    sendContentMessage<InjectMessage>({
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
    const [allowTranslate] = eventFilter(event, ['translate'], options.targetType)
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