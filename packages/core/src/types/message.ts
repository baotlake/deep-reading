import {WordData} from "./wrp"

export enum PostMessageType {
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
}

interface LookUpMessageData {
    type: PostMessageType.lookUp
    text: string
    position: DOMRect
}

interface LookUpPositionMessageData {
    type: PostMessageType.lookUpPosition
    position: DOMRect
}

interface RangeRectMessageData {
    type: PostMessageType.rangeRect,
    word?: DOMRect,
    sentence?: DOMRect,
}

interface OpenMessageData {
    type: PostMessageType.open
    href: string
}

interface HistoryStateMessageData {
    type: PostMessageType.historyState
    href: string
}

interface TapBlankMessageData {
    type: PostMessageType.tapBlank
}

interface TranslateMessageData {
    type: PostMessageType.translate
    text: string
    position: DOMRect
}

interface RefusedDisplayMessageData {
    type: PostMessageType.refusedDisplay
}

interface SummaryMessageData {
    type: PostMessageType.summary
    summary: {
        icon: string
        title: string
        description: string
    }
}

interface HeartbeatMessageData {
    type: PostMessageType.heartbeat
}

interface PlayPronunciationMessageData {
    type: PostMessageType.playPronunciation,
    data: {
        word: string,
        url: string,
        type: 'am' | 'en' | 'other'
    }
}



export enum ReceiveMessageType {
    revertScroll = 'revertScroll',
}

interface RevertScrollMessageData {
    type: ReceiveMessageType.revertScroll
}

interface LookUpResultMessageData {
    type: PostMessageType.lookUpResult
    data: WordData
}

interface TranlsateResultMessage {
    type: PostMessageType.translateResult
    data: any
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
