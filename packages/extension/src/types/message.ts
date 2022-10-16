import type { TargetType, MessageData } from '@wrp/core'

interface ShowContentPopupMessage {
    type: 'showContentPopup',
    payload: {
        tab: chrome.tabs.Tab,
    }
}

interface ContentStartMessage {
    type: 'contentActive'
    // payload: {
    //     url: string
    // }
}

interface InitContentMessage {
    type: 'initContent'
    payload: {
        enable: boolean
        mode: TargetType
        customized: boolean
        coverVisible: boolean
    }
}

interface OpenPageMessage {
    type: 'openPage'
    payload: {
        url: string
        target?: string
    }
}

interface NoPalyloadMessage {
    type:
    | 'enable'
    | 'disable'
    | 'popupActive'
    | 'hello'
    | ''
}

export type ExtMessageData =
    | MessageData
    | ShowContentPopupMessage
    | ContentStartMessage
    | InitContentMessage
    | OpenPageMessage
    | NoPalyloadMessage

