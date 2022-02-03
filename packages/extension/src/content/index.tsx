
import {
    MessageData,
    startExtensionContent,
    sendContentMessage,
    addMessageListener,
    MessageType,
} from '@wrp/core'
import { ExtMessageData, ExtMessageType } from '../types/message';
import { createApp } from './root'

type Sender = chrome.runtime.MessageSender
function hanldeMessage(data: MessageData | ExtMessageData, sender: Sender) {
    console.warn(data, sender)
    switch (data.type) {
        case MessageType.translateResult:
        case MessageType.lookUpResult:
            sendContentMessage(data)
            break
    }
}

// chrome.runtime.onMessage.addListener(hanldeMessage)
addMessageListener(hanldeMessage)
createApp();
startExtensionContent()
