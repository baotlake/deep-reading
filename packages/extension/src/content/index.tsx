
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

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>

function init(data: InitContentMessage) {
    const { enable, mode } = data.payload
    if (!enable) return

    start()
    createApp()
    setMode(mode)
}

type Sender = chrome.runtime.MessageSender
function hanldeMessage(data: MessageData | ExtMessageData, sender: Sender) {
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
            setMode(data.payload.mode)
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
