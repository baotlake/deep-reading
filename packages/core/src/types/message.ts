import {WordData} from "./wrp"

export enum MessageType {
    lookUp = 'lookUp',
    lookUpPosition = 'lookUpPosition',
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
}

interface LookUpMessageData {
    type: MessageType.lookUp
    text: string
    position: DOMRect
}

interface LookUpPositionMessageData {
    type: MessageType.lookUpPosition
    position: DOMRect
}

interface RangeRectMessageData {
    type: MessageType.rangeRect,
    word?: DOMRect,
    sentence?: DOMRect,
}

interface OpenMessageData {
    type: MessageType.open
    href: string
}

interface HistoryStateMessageData {
    type: MessageType.historyState
    href: string
}

interface TapBlankMessageData {
    type: MessageType.tapBlank
}

interface TranslateMessageData {
    type: MessageType.translate
    text: string
    position: DOMRect
}

interface RefusedDisplayMessageData {
    type: MessageType.refusedDisplay
}

interface SummaryMessageData {
    type: MessageType.summary
    summary: {
        icon: string
        title: string
        description: string
    }
}

interface HeartbeatMessageData {
    type: MessageType.heartbeat
}

interface PlayPronunciationMessageData {
    type: MessageType.playPronunciation,
    data: {
        word: string,
        url: string,
        type: 'am' | 'en' | 'other'
    }
}

interface RevertScrollMessageData {
    type: MessageType.restoreScroll
}

interface LookUpResultMessageData {
    type: MessageType.lookUpResult
    data: WordData
}

interface TranlsateResultMessage {
    type: MessageType.translateResult
    data: any
}

interface DOMContentLoadedMessage {
    type: MessageType.DOMContentLoaded
}

interface ReadyStateChangeMessage {
    type: MessageType.readyStateChange
    state: typeof document.readyState
}

export type MessageData =
    | LookUpMessageData
    | LookUpPositionMessageData
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


