import {
    extractWordRange,
    getCoparent,
    getTarget,
    extractSentenceRange,
} from '@wrp/core'
import { options } from '../options'
import { findLink } from '../utils'
import {
    wordFilter,
    targetFilter,
    deltaFilter,
    actionFilter,
    actionsFilter,
} from '../filter'
import { unzip } from 'lodash-es'
import type { Action, InjectMessage } from '../../type'
import { sendContentMessage } from '../message'

let downTimeStamp = 0
let downXY = [0, 0]
let downEvent: PointerEvent | null = null
let upTimeStamp = 0
let upXY = [0, 0]

export function handlePointerDown(e: PointerEvent) {
    downTimeStamp = e.timeStamp
    downXY = [e.clientX, e.clientY]
    downEvent = e
}

export function handlePointerUp(e: PointerEvent) {
    upTimeStamp = e.timeStamp
    upXY = [e.clientX, e.clientY]

    console.log('handlePointerUp', e)
    if (!downEvent) return
    if (e.pointerType == 'mouse') return
    if (e.pointerType === 'touch') {
        // address by handleTouchEnd
        return
    }

    const deltaT = upTimeStamp - downTimeStamp
    const deltaX = upXY[0] - downXY[0]
    const deltaY = upXY[1] - downXY[1]

    translateGesture(downEvent, deltaT, deltaX, deltaY)
}

export function handleTouchEnd(e: TouchEvent) {
    console.log('handleTouchEnd', e.touches.length, e)
    if (e.changedTouches.length !== 1) return
    if (!downEvent) return
    const deltaT = e.timeStamp - downTimeStamp
    const endXY = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
    const deltaY = endXY[1] - downXY[1]
    const deltaX = endXY[0] - downXY[0]

    translateGesture(downEvent, deltaT, deltaX, deltaY)
}

function translateGesture(
    e: PointerEvent,
    deltaT: number,
    deltaX: number,
    deltaY: number
) {
    if (!e) return
    if (deltaT > 1500) return
    // "Y" axis max value
    if (Math.abs(deltaY) > 50) return
    if (Math.abs(deltaX) < 25) return
    if (Math.abs(deltaX / deltaY) < 2) return
    const path = e.composedPath()
    const allowTranslate = actionFilter(path, 'translate')
    if (!allowTranslate) return

    const target = getTarget(e.clientX, e.clientY)
    if (!target) return

    handleTranslate(target)
}

export function handleClick(e: PointerEvent | MouseEvent) {
    const deltaT = upTimeStamp - downTimeStamp
    const deltaD = Math.hypot(upXY[0] - downXY[0], upXY[1] - downXY[1])

    const path = e.composedPath()
    if (!targetFilter(path, options.targetType)) return

    const actions: Action[] = ['lookup', 'translate', 'link']
    const [allowLookup, allowTranslate, allowLink] = unzip<boolean>([
        deltaFilter(actions, deltaT, deltaD),
        actionsFilter(actions, path),
    ]).map((a: boolean[]) => a.every((v) => v))

    if (!allowLookup && !allowTranslate && !allowLink) return

    const target = getTarget(e.clientX, e.clientY)
    if (allowLink) handleIfClickLink(e, target)
    if (!target) return

    if (allowLookup) {
        handleLookup(target)
    }

    if (!allowLookup && allowTranslate) {
        handleTranslate(target)
    }
}

function handleIfClickLink(e: MouseEvent, target: [Text, number] | null) {
    let link = findLink(e.target as HTMLElement)
    let direct = true
    if (!link && target) {
        link = findLink(target[0])
        direct = false
    }
    console.log('handleIfClickLink', link)
    if (!link) return

    const href = link.href
    const isHttp = href && /https?:/.test(href)

    console.log('handleIfClickLink', link, href, isHttp)

    if (!isHttp) return

    if (options.preventClickLink) e.preventDefault()

    const title = link.textContent || link.title || ''

    sendContentMessage<InjectMessage>({
        type: 'anchor',
        payload: {
            element: link,
            url: href,
            title,
        },
    })
}

function handleLookup(target: [Text, number]) {
    const range = extractWordRange(...target)
    if (!range) return
    const text = range.toString()
    if (!wordFilter(text)) return

    const coparent = getCoparent(range.startContainer, range.endContainer)
    if (!coparent) return

    sendContentMessage<InjectMessage>({
        type: 'lookupRange',
        payload: {
            range,
        },
    })

    range.detach()
}

function handleTranslate(target: [Text, number]) {
    const range = extractSentenceRange(...target)
    if (!range) return
    const text = range.toString()

    const coparent = getCoparent(range.startContainer, range.endContainer)
    if (!coparent) return

    sendContentMessage<InjectMessage>({
        type: 'translateRange',
        payload: {
            range,
        },
    })

    range.detach()
}
