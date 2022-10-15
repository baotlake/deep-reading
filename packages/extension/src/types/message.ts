import type { TargetType } from '@wrp/core'

export type ExtMessageType =
    | 'showContentPopup'
    | 'contentActive'
    | 'initContent'
    | 'enable'
    | 'disable'
    | 'popupActive'
    | 'hello'
    | ''


interface MessageWithType {
    type: ExtMessageType
    tabId?: number
}

interface ShowContentPopupMessage extends MessageWithType {
    type: 'showContentPopup'
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
        mode: TargetType
        customized: boolean
        coverVisible: boolean
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
    | ContentStartMessage
    | InitContentMessage
    | NoPalyloadMessage

