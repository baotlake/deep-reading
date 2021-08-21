import {WordData} from "./wrp"

export enum PostMessageType {
    lookUp = 'lookUp',
    lookUpPosition = 'lookUpPosition',
    open = 'open',
    historyState = 'historyState',
    tapBlank = 'tapBlank',
    translate = 'translate',
    refusedDisplay = 'refusedDisplay',
    summary = 'summary',
    heartbeat = 'heartbeat',
    lookUpResult = 'lookUpResult',
    translateResult = 'translateResult',
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
