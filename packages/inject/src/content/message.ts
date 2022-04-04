import { MessageData } from "@wrp/core"
import { getParent } from "./parent"

const extension = !!globalThis.chrome?.runtime?.getManifest?.()?.version

export function sendMessage<T = MessageData>(message: T) {
    if (extension) {
        chrome.runtime.sendMessage(message)
    } else {
        const parent = getParent()
        parent.postMessage(message, '*')
    }
}

type Sender = chrome.runtime.MessageSender | MessageEventSource | null

export function addMessageListener<T>(fn: (data: T, sender?: Sender) => void) {
    if (extension) {
        chrome.runtime.onMessage.addListener(fn)
        return () => chrome.runtime.onMessage.removeListener(fn)
    }

    const handle = (e: MessageEvent) => {
        fn(e.data, e.source)
    }
    window.addEventListener('message', handle)
    return () => window.removeEventListener('message', handle)
}

const EVENT_TYPE = 'dl_content_message_' + Math.round(Math.random() * 1e6)
let eventTarget: EventTarget | Document

function getEventTarget() {
    if (!eventTarget) {
        /**
         * Firefox 中使用 new EventTarget() 无法触发事件，导致消息无法送达
         * 改为使用 document 派发事件
         */

        // messageEventTarget = new EventTarget()
        eventTarget = globalThis.document
        console.log('window', window)
    }
    return eventTarget
}


export function sendContentMessage<T>(data: T) {
    const event = new CustomEvent(EVENT_TYPE, { detail: { data } })
    const eventTarget = getEventTarget()
    setTimeout(() => {
        eventTarget.dispatchEvent(event)
    }, 0)

    console.log('sendContentMessage: ', data, eventTarget, event)
}

export function addContentMessageListener<T>(fn: (data: T) => void) {
    const handle = (e: CustomEvent) => {
        fn(e.detail.data)
        console.log('content message handle', e, fn)
    }
    const eventTarget = getEventTarget()
    eventTarget.addEventListener(EVENT_TYPE, handle as any)
    return () => eventTarget.removeEventListener(EVENT_TYPE, handle as any)
}