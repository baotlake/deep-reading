import type { MessageData } from "@wrp/core"
import { ExtMessageData } from "../types/message"

import { lookUp, translate } from './core'
import {
    checkContent,
    handleContentActive,
    handleOnOff,
    handleTargetType,
    handleCoverVisibleChange,
    handleSetCoverVisible,
} from './content'

type MessageSender = chrome.runtime.MessageSender

export function handleMessage(message: MessageData | ExtMessageData, sender: MessageSender, response: (res?: boolean) => void) {
    response(true)
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
        case 'setTargetType':
            handleTargetType(data)
            break
        case 'popupActive':
            checkContent()
            break
        case 'setCoverVisible':
            handleSetCoverVisible(data, sender)
            break
        case 'coverVisibleChange':
            handleCoverVisibleChange(data, sender)
            break
    }

    return true
}
