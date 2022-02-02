
import {
    MessageData,
    startExtensionContent,
    sendContentMessage,
    addMessageListener,
} from '@wrp/core'
import { ExtMessageData, ExtMessageType } from '../types/message';
import { createApp } from './root'

function forwardMessage(data: MessageData | ExtMessageData) {
    switch (data.type) {
        case ExtMessageType.showPopup:
            sendContentMessage(data)
            break
    }
}

addMessageListener(forwardMessage)
createApp();
startExtensionContent()
