export enum PostMessageType {
    lookUp = 'lookUp',
    lookUpPosition = 'lookUpPosition',
    open = 'open',
    historyState = 'historyState',
    tapBlank = 'tapBlank',
    translate = 'translate',
    refusedDisplay = 'refusedDisplay',
    summary = 'summary',
}

export interface LookUpMessageData {
    type: PostMessageType.lookUp
    text: string
    position: DOMRect
}

export interface LookupPositionMessageData {
    type: PostMessageType.lookUpPosition
    position: DOMRect
}

export interface OpenMessageData {
    type: PostMessageType.open
    href: string
}

export interface HistoryStateMessageData {
    type: PostMessageType.historyState
    href: string
}

export interface TapBlankMessageData {
    type: PostMessageType.tapBlank
}

export interface TranlateMessageData {
    type: PostMessageType.translate
    text: string
    position: DOMRect
}

export interface RefusedDisplayMessageData {
    type: PostMessageType.refusedDisplay
}

export interface SummaryMessageData {
    type: PostMessageType.summary
    summary: {
        icon: string
        title: string
        description: string
    }
}

export enum ReceiveMessageType {
    revertScroll = 'revertScroll',
    saveScroll = 'saveScroll',
}

export interface RevertScrollMessageData {
    type: ReceiveMessageType.revertScroll
}

export interface SaveScrollMessageData {
    type: ReceiveMessageType.saveScroll
}

export type MessageData =
    | LookUpMessageData
    | LookupPositionMessageData
    | OpenMessageData
    | HistoryStateMessageData
    | TapBlankMessageData
    | TranlateMessageData
    | RefusedDisplayMessageData
    | RevertScrollMessageData
    | SaveScrollMessageData
    | SummaryMessageData
