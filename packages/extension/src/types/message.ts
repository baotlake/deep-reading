import type { TriggerMode } from '@wrp/core'

export type ExtMessageType =
    | 'showContentPopup'
    | 'setTriggerMode'
    | 'contentActive'
    | 'initContent'
    | 'enable'
    | 'disable'
    | 'popupActive'
    | 'hello'
    | ''


interface MessageWithType {
    type: ExtMessageType
}

interface ShowContentPopupMessage extends MessageWithType {
    type: 'showContentPopup'
}

interface SetTriggerModeMessage extends MessageWithType {
    type: 'setTriggerMode'
    payload: {
        mode: TriggerMode,
        host: string,
        customized?: boolean,
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
        customized: boolean
    }
}

interface NoPalyloadMessage extends MessageWithType {
    type:
    | 'enable'
    | 'disable'
    | 'popupActive'
    | 'hello'
    | ''
}

export type ExtMessageData = | ShowContentPopupMessage
    | SetTriggerModeMessage
    | ContentStartMessage
    | InitContentMessage
    | NoPalyloadMessage

