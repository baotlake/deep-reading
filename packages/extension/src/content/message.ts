import { MessageData, TargetType, } from '@wrp/core'
import { sendContentMessage } from '@wrp/inject'
import { ExtMessageData } from '../types/message'
import { init, enable, disable } from './root'

type Sender = chrome.runtime.MessageSender
type SendResponse = (response: boolean) => void
export function hanldeExtMessage(data: ExtMessageData, sender: Sender, sendResponse: SendResponse) {
    sendResponse(true)

    console.warn(data, sender)
    switch (data.type) {
        case 'initContent':
            init(data)
            break
        case 'enable':
            enable()
            break
        case 'disable':
            disable()
            break
        case 'showContentPopup':
        case 'translateResult':
        case 'lookUpResult':
        case 'setCoverVisible':
        case 'setTargetType':
            sendContentMessage(data)
            break
        // broadcast message
        default:
            break
    }
}

export function handleContentMessage(data: MessageData) {
    switch (data.type) {
        default:
            break
    }
}