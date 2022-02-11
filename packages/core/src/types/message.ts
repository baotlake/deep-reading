import { WordData } from "./wrp"

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

interface LookUpMessageData {
    type: 'lookUp'
    text: string
    position: DOMRect
}

interface RangeRectMessageData {
    type: 'rangeRect'
    word?: DOMRect
    sentence?: DOMRect
}

interface OpenMessageData {
    type: 'open'
    href: string
}

interface HistoryStateMessageData {
    type: 'historyState'
    href: string
}

interface TapBlankMessageData {
    type: 'tapBlank'
}

interface TranslateMessageData {
    type: 'translate'
    text: string
    position: DOMRect
}

interface RefusedDisplayMessageData {
    type: 'refusedDisplay'
}

interface SummaryMessageData {
    type: 'summary'
    summary: {
        icon: string
        title: string
        description: string
    }
}

interface HeartbeatMessageData {
    type: 'heartbeat'
}

interface PlayPronunciationMessageData {
    type: 'playPronunciation'
    data: {
        word: string,
        url: string,
        type: 'am' | 'en' | 'other'
    }
}

interface RevertScrollMessageData {
    type: 'restoreScroll'
}

interface LookUpResultMessageData {
    type: 'lookUpResult'
    data: WordData
}

interface TranlsateResultMessage {
    type: 'translateResult'
    data: any
}

interface DOMContentLoadedMessage {
    type: 'DOMContentLoaded'
}

interface ReadyStateChangeMessage {
    type: 'readyStateChange'
    state: typeof document.readyState
}

interface ComponentsVisibleChangeMessage {
    type: 'componentsVisibleChange'
    payload: {
        explanation: boolean
        translation: boolean
    }
}

interface NoPayloadMessage {
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


