import { WordData, TriggerMode } from "./type"

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
    | 'setTriggerMode'
    | 'setCoverVisible'
    | 'coverVisibleChange'

    | 'restoreScroll'
    | 'closeExplanation'
    | 'closeTranslation'

    | 'viewLoad'
    | 'viewDoc'

    | 'DOMContentLoaded'
    | 'readyStateChange'
    | 'load'

interface MessageWithType {
    type: MessageType
    tabId?: number
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
    payload: {
        url: string
        title: string
        blank?: boolean
    }
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

interface SetTriggerModeMessage extends MessageWithType {
    type: 'setTriggerMode'
    payload: {
        mode: TriggerMode
        host: string
        customized?: boolean
        activeTabId?: number
    }
}

interface CoverVisibleMessage extends MessageWithType {
    type: 'coverVisibleChange' | 'setCoverVisible',
    payload: {
        visible: boolean
        tabId?: number
    }
}

interface ViewDocMessage extends MessageWithType {
    type: 'viewDoc',
    payload: {
        doc: string
    }
}

interface NoPayloadMessage extends MessageWithType {
    type: 'closeExplanation'
    | 'closeTranslation'
    | 'DOMContentLoaded'
    | 'load'
    | 'viewLoad'
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
    | SetTriggerModeMessage
    | CoverVisibleMessage
    | ViewDocMessage
    | NoPayloadMessage


