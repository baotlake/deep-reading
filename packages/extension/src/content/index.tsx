
import {
    MessageData,
    TriggerMode,
} from '@wrp/core'
import {
    start,
    remove,
    sendContentMessage,
    addContentMessageListener,
} from '@wrp/inject'

import { ExtMessageData, ExtMessageType } from '../types/message'
import { createApp, unmountApp } from './root'
import { addMessageListener, sendMessage } from '../uitls/extension'


const contentData = {
    enable: false,
    hostname: '',
    customizedMode: false,
    triggerMode: 'disable' as TriggerMode,
}

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>
async function init(data: InitContentMessage) {
    const { enable, mode, customized, coverVisible } = data.payload
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

    if (coverVisible) {
        sendContentMessage<MessageData>({
            type: 'setCoverVisible',
            payload: {
                visible: coverVisible,
            }
        })
    }
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
}

function enable() {
    if (contentData.enable) return
    contentData.enable = true

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

function disable() {
    if (contentData.enable === false) return
    contentData.enable = false

    remove()
    unmountApp()
}

type Message = MessageData | ExtMessageData
type Sender = chrome.runtime.MessageSender
type SendResponse = (response: boolean) => void
function hanldeExtMessage(data: Message, sender: Sender, sendResponse: SendResponse) {
    sendResponse(true)

    console.warn(data, sender)
    switch (data.type) {
        case 'initContent':
            init(data)
            break
        case 'translateResult':
        case 'lookUpResult':
        case 'setCoverVisible':
            sendContentMessage(data)
            break
        // broadcast message
        case 'setTriggerMode':
            setTriggerMode(data)
            break
        case 'enable':
            enable()
            break
        case 'disable':
            disable()
            break
    }
}

function handleContentMessage(data: MessageData) {
    switch (data.type) {
        case 'coverVisibleChange':
            sendMessage(data)
            break
    }
}

addMessageListener(hanldeExtMessage)
addContentMessageListener<MessageData>(handleContentMessage)

sendMessage<ExtMessageData>({
    type: 'contentActive',
})