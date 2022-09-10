import { sendContentMessage } from '../message'
import {
    detectRefused,
    abstractProfile,
} from '../utils'
import type { MessageData } from "@wrp/core"

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