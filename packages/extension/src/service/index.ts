import { MessageData, MessageType } from "@wrp/core";
import { ExtMessageData } from "../types/message";

import { lookUp, translate } from './core'

type MessageSender = chrome.runtime.MessageSender

export function handleMessage(message: MessageData | ExtMessageData, sender: MessageSender, response: (res?: boolean) => void) {
    console.log(message, sender)
    const data = { ...message }
    switch (data.type) {
        case MessageType.lookUp:
            lookUp(data, sender)
            break
        case MessageType.translate:
            translate(data, sender)
            break
    }

    return true
}
