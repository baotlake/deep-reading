import { MessageData } from "../types/message"
import { getParent } from "./parent"

const extension = !!globalThis.chrome?.runtime?.getManifest().version

export function sendMessage<T = MessageData>(message: T) {
    if (extension) {
        chrome.runtime.sendMessage(message)
    } else {
        const parent = getParent()
        parent.postMessage(message)
    }
}

export function addMessageListener<T>(fn: (data: T) => void) {
    if (extension) {
        chrome.runtime.onMessage.addListener(fn)
        return () => chrome.runtime.onMessage.removeListener(fn)
    }

    const handle = (e: MessageEvent) => {
        fn(e.data)
    }
    window.addEventListener('message', handle)
    return () => window.removeEventListener('message', handle)
}

const EVENT_TYPE = 'dl_content_message'
const eventTarget = new EventTarget()


export function sendContentMessage<T>(data: T) {
    const event = new CustomEvent(EVENT_TYPE, { detail: { data } })
    setTimeout(() => {
        eventTarget.dispatchEvent(event)
    }, 0)
    console.log('content send message')
}

export function addContentMessageListener<T>(fn: (data: T) => void) {
    const handle = (e: CustomEvent) => {
        fn(e.detail.data)
        console.log('content message handle')
    }
    eventTarget.addEventListener(EVENT_TYPE, handle as any)
    return () => { }
    // return () => eventTarget.removeEventListener(EVENT_TYPE, handle as any)
}