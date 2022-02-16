import { MessageData, MessageType } from "@wrp/core";
import { ExtMessageData } from "../types/message";

import { lookUp, translate } from './core'
import { handleContentActive, handleOnOff } from './content'

type MessageSender = chrome.runtime.MessageSender

export function handleMessage(message: MessageData | ExtMessageData, sender: MessageSender, response: (res?: boolean) => void) {
    console.log(message, sender)
    const data = { ...message }
    switch (data.type) {
        case 'contentActive':
            handleContentActive(data, sender)
            break
        case 'enable':
        case 'disable':
            handleOnOff(data.type === 'enable')
            break
        case 'lookUp':
            lookUp(data, sender)
            break
        case 'translate':
            translate(data, sender)
            break

    }

    return true
}
