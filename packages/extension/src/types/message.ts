import type { TriggerMode } from '@wrp/core'

export type ExtMessageType =
    | 'showPopup'
    | 'setTriggerMode'
    | 'contentActive'
    | 'initContent'
    | 'enable'
    | 'disable'
    | ''


interface MessageWithType {
    type: ExtMessageType
}

interface ShowPopupMessage extends MessageWithType {
    type: 'showPopup'
}

interface SetTriggerModeMessage extends MessageWithType {
    type: 'setTriggerMode'
    payload: {
        mode: TriggerMode
    }
}

interface ContentStartMessage extends MessageWithType {
    type: 'contentActive'
    // payload: {
    //     url: string
    // }
}

interface InitContentMessage extends MessageWithType {
    type: 'initContent'
    payload: {
        enable: boolean
        mode: TriggerMode
        own: boolean
    }
}

interface NoPalyloadMessage extends MessageWithType {
    type:
    | 'enable'
    | 'disable'
    | ''
}

export type ExtMessageData = | ShowPopupMessage
    | SetTriggerModeMessage
    | ContentStartMessage
    | InitContentMessage
    | NoPalyloadMessage