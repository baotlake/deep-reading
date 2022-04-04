
import {
    MessageData,
    TriggerMode,
} from '@wrp/core'
import {
    start,
    remove,
    sendContentMessage,
} from '@wrp/inject'

import { ExtMessageData, ExtMessageType } from '../types/message'
import { createApp, unmountApp } from './root'
import { addMessageListener, sendMessage } from '../uitls/extension'


const contentData = {
    // enable: false,
    hostname: '',
    customizedMode: false,
    triggerMode: 'disable' as TriggerMode,
}

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>
async function init(data: InitContentMessage) {
    const { enable, mode, customized } = data.payload
    // contentData.enable = enable
    contentData.hostname = new URL(location.href).hostname
    contentData.customizedMode = customized
    contentData.triggerMode = mode

    if (!enable) return

    start()
    await createApp()

    sendContentMessage<MessageData>({
        type: 'setTriggerMode',
        payload: {
            mode: mode,
            host: contentData.hostname,
            customized: customized,
        }
    })
}

type SetTriggerModeMessage = Extract<MessageData, { type: 'setTriggerMode' }>
function setTriggerMode(data: SetTriggerModeMessage) {
    const { customized, host, mode, activeTabId } = data.payload
    if (typeof customized === 'boolean') {
        contentData.customizedMode = customized
    }
    const { hostname, customizedMode } = contentData
    const isHost = customizedMode && hostname === host
    const isGlobal = !customizedMode && host === '*'

    if (isHost || isGlobal) {
        sendContentMessage(data)
        contentData.triggerMode = mode
    }

    if (isHost || (isGlobal && activeTabId === data.tabId)) {
        sendContentMessage<MessageData>({
            type: 'coverVisible',
            payload: {
                visible: mode === 'cover',
            }
        })
    }
}

function enable() {
    start()
    createApp()
    const { customizedMode, triggerMode, hostname } = contentData
    sendContentMessage<MessageData>({
        type: 'setTriggerMode',
        payload: {
            mode: triggerMode,
            host: hostname,
            customized: customizedMode,
        }
    })
}

type Message = MessageData | ExtMessageData
type Sender = chrome.runtime.MessageSender
type SendResponse = (response: boolean) => void
function hanldeMessage(data: Message, sender: Sender, sendResponse: SendResponse) {
    sendResponse(true)

    console.warn(data, sender)
    switch (data.type) {
        case 'initContent':
            init(data)
            break
        case 'translateResult':
        case 'lookUpResult':
            sendContentMessage(data)
            break
        case 'setTriggerMode':
            // broadcast message
            setTriggerMode(data)
            break
        case 'enable':
            enable()
            break
        case 'disable':
            remove()
            unmountApp()
            break
    }
}

addMessageListener(hanldeMessage)

sendMessage<ExtMessageData>({
    type: 'contentActive',
})