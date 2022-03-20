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

    | 'restoreScroll'
    | 'closeExplanation'
    | 'closeTranslation'
    | 'componentsVisibleChange'

    | 'DOMContentLoaded'
    | 'readyStateChange'
    | 'load'

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

interface SetTriggerModeMessage extends MessageWithType {
    type: 'setTriggerMode'
    payload: {
        mode: TriggerMode,
        host: string,
        customized?: boolean,
    }
}

interface NoPayloadMessage extends MessageWithType {
    type: 'closeExplanation'
    | 'closeTranslation'
    | 'DOMContentLoaded'
    | 'load'
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
    | SetTriggerModeMessage
    | NoPayloadMessage


