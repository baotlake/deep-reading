
import {
    MessageData,
} from '@wrp/core'
import {
    start,
    remove,
    sendContentMessage,
    setMode,
    mode,
} from '@wrp/inject'

import { ExtMessageData, ExtMessageType } from '../types/message'
import { createApp, unmountApp } from './root'
import { addMessageListener, sendMessage } from '../uitls/extension'


const contentData = {
    // enable: false,
    hostname: '',
    customizedMode: false,
}

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>
function init(data: InitContentMessage) {
    const { enable, mode, customized } = data.payload
    // contentData.enable = enable
    contentData.hostname = new URL(location.href).hostname
    contentData.customizedMode = customized

    if (!enable) return

    start()
    createApp()
    setMode(mode)
}

type SetTriggerModeMessage = Extract<ExtMessageData, { type: 'setTriggerMode' }>
function setTriggerMode(data: SetTriggerModeMessage) {
    // broadcast message
    const { customized, host, mode } = data.payload
    if (typeof customized === 'boolean') {
        contentData.customizedMode = customized
    }
    const { hostname, customizedMode } = contentData

    if (customizedMode && hostname === host) {
        console.log('setMode customized')
        setMode(data.payload.mode)
    }
    if (!customizedMode && host === '*') {
        console.log('setMode global')
        setMode(data.payload.mode)
    }
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
            setTriggerMode(data)
            break
        case 'enable':
            start()
            createApp()
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
