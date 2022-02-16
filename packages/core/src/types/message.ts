import { WordData } from "./type"

enum MessageType_ {
    lookUp = 'lookUp',
    // lookUpPosition = 'lookUpPosition',
    rangeRect = 'rangeRect',
    open = 'open',
    historyState = 'historyState',
    tapBlank = 'tapBlank',
    translate = 'translate',
    refusedDisplay = 'refusedDisplay',
    summary = 'summary',
    heartbeat = 'heartbeat',
    lookUpResult = 'lookUpResult',
    translateResult = 'translateResult',
    playPronunciation = 'playPronunciation',
    DOMContentLoaded = 'DOMContentLoaded',
    readyStateChange = 'readyStateChange',
    restoreScroll = 'restoreScroll',
    closeExplanation = 'closeExplanation',
    closeTranslation = 'closeTranslation',
    componentsVisibleChange = 'componentsVisibleChange',
}

export type MessageType =
    'lookUp'
    | 'rangeRect'
    | 'open'
    | 'historyState'
    | 'tapBlank'
    | 'translate'
    | 'refusedDisplay'
    | 'summary'
    | 'heartbeat'
    | 'lookUpResult'
    | 'translateResult'
    | 'playPronunciation'
    | 'DOMContentLoaded'
    | 'readyStateChange'
    | 'restoreScroll'
    | 'closeExplanation'
    | 'closeTranslation'
    | 'componentsVisibleChange'

interface MessageWithType {
    type: MessageType
}

interface LookUpMessageData extends MessageWithType {
    type: 'lookUp'
    text: string
    position: DOMRect
}

interface RangeRectMessageData extends MessageWithType {
    type: 'rangeRect'
    word?: DOMRect
    sentence?: DOMRect
}

interface OpenMessageData extends MessageWithType {
    type: 'open'
    href: string
    blank?: boolean
}

interface HistoryStateMessageData extends MessageWithType {
    type: 'historyState'
    href: string
}

interface TapBlankMessageData extends MessageWithType {
    type: 'tapBlank'
}

interface TranslateMessageData extends MessageWithType {
    type: 'translate'
    text: string
    position: DOMRect
}

interface RefusedDisplayMessageData extends MessageWithType {
    type: 'refusedDisplay'
}

interface SummaryMessageData extends MessageWithType {
    type: 'summary'
    summary: {
        icon: string
        title: string
        description: string
    }
}

interface HeartbeatMessageData extends MessageWithType {
    type: 'heartbeat'
}

interface PlayPronunciationMessageData extends MessageWithType {
    type: 'playPronunciation'
    data: {
        word: string,
        url: string,
        type: 'am' | 'en' | 'other'
    }
}

interface RevertScrollMessageData extends MessageWithType {
    type: 'restoreScroll'
}

interface LookUpResultMessageData extends MessageWithType {
    type: 'lookUpResult'
    data: WordData
}

interface TranlsateResultMessage extends MessageWithType {
    type: 'translateResult'
    data: any
}

interface DOMContentLoadedMessage extends MessageWithType {
    type: 'DOMContentLoaded'
}

interface ReadyStateChangeMessage extends MessageWithType {
    type: 'readyStateChange'
    state: typeof document.readyState
}

interface ComponentsVisibleChangeMessage extends MessageWithType {
    type: 'componentsVisibleChange'
    payload: {
        explanation: boolean
        translation: boolean
    }
}

interface NoPayloadMessage extends MessageWithType {
    type: 'closeExplanation'
    | 'closeTranslation'
}

export type MessageData =
    | LookUpMessageData
    // | LookUpPositionMessageData
    | RangeRectMessageData
    | OpenMessageData
    | HistoryStateMessageData
    | TapBlankMessageData
    | TranslateMessageData
    | RefusedDisplayMessageData
    | RevertScrollMessageData
    | SummaryMessageData
    | HeartbeatMessageData
    | LookUpResultMessageData
    | TranlsateResultMessage
    | PlayPronunciationMessageData
    | DOMContentLoadedMessage
    | ReadyStateChangeMessage
    | ComponentsVisibleChangeMessage
    | NoPayloadMessage


