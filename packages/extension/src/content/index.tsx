
import {
    MessageData,
    // startExtensionContent,
    // sendContentMessage,
    // addMessageListener,
    MessageType,
} from '@wrp/core'
import {
    start,
    remove,
    sendContentMessage,
} from '@wrp/inject'

import { ExtMessageData, ExtMessageType } from '../types/message';
import { createApp } from './root'
import { addMessageListener } from '../uitls/extension'

type Sender = chrome.runtime.MessageSender
function hanldeMessage(data: MessageData | ExtMessageData, sender: Sender) {
    console.warn(data, sender)
    switch (data.type) {
        case 'translateResult':
        case 'lookUpResult':
            sendContentMessage(data)
            break
    }
}

// chrome.runtime.onMessage.addListener(hanldeMessage)
addMessageListener(hanldeMessage)
createApp();
start()
