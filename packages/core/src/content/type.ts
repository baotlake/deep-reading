export enum PostMessageType {
    lookUp = 'lookUp',
    lookUpPosition = 'lookUpPosition',
    open = 'open',
    historyState = 'historyState',
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
    href: URL
}

export interface HistoryStateMessageData {
    type: PostMessageType.historyState
    href: URL
}

export type MessageData =
    | LookUpMessageData
    | LookupPositionMessageData
    | OpenMessageData
    | HistoryStateMessageData
