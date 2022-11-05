import { sendContentMessage } from './message'

import {
    MessageData,
    detectRefusedDisplay,
    abstract,
    getCoparentElement,
    client2pageRect,
} from '@wrp/core'

interface MouseData {
    x: number
    y: number
    timeStamp: number
}

export function isClick(timeStamp: number, up: MouseData, down: MouseData) {
    const mouseClick = timeStamp - up.timeStamp < 5
    const shortClick = up.timeStamp - down.timeStamp < 300
    const noMove =
        Math.max(Math.abs(up.x - down.x), Math.abs(up.y - down.y)) < 3

    if (mouseClick) {
        return shortClick && noMove
    }
    return true
}

export function isPress(timeStamp: number, up: MouseData, down: MouseData) {
    const mouseClick = timeStamp - up.timeStamp < 5
    const press =
        up.timeStamp - down.timeStamp >= 300 &&
        up.timeStamp - down.timeStamp < 1000
    const noMove = Math.hypot(up.x - down.x, up.y - down.y) < 3

    if (mouseClick) {
        return press && noMove
    }
    console.log('press noMove', press, noMove)
    return false
}

export function detectRefused() {
    const refused = detectRefusedDisplay()

    refused &&
        sendContentMessage({
            type: 'refusedDisplay',
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
        const href =
            current instanceof HTMLElement && current.getAttribute('href')
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
            const element = document.querySelector(
                '#' + hash + ',[name="' + hash + '"]'
            )
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
                },
            })
        }
    }
}

type FallbackLoadErrorMessage = Extract<
    MessageData,
    { type: 'fallbackLoadError' }
>
export function proxyFaild(data: FallbackLoadErrorMessage) {
    const { payload } = data
    switch (payload.name) {
        case 'link':
            const element = document.querySelector<HTMLLinkElement>(
                `link[rel="${payload.rel}"][href="${payload.href}"]`
            )
            if (!element) return
            element.href = payload.proxy
            element.dataset.originalHref = payload.href
            break
    }
}

export function tracePosition(
    element: Element,
    old: DOMRect,
    oldRangeRect: DOMRect
) {
    if (!element || !old) return null
    const rect = client2pageRect(element.getBoundingClientRect())
    console.log('-->', old, rect)
    if (old.width - rect.width < 2 && old.height - rect.height < 2) {
        return [rect.left - old.left, rect.top - old.top] as [number, number]
    }
    return DOMRect.fromRect({
        x: oldRangeRect.x + rect.x - old.x,
        y: oldRangeRect.y + rect.y - old.y,
        width: oldRangeRect.width,
        height: oldRangeRect.height,
    })
}
