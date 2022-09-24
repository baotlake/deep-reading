import { WordData, TriggerMode } from "./type"

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

interface TargetPositionMessageData {
    type: 'targetPosition'
    payload: {
        word?: DOMRect | [number, number] | null
        sentence?: DOMRect | [number, number] | null
    }
}

interface OpenMessageData {
    type: 'open'
    payload: {
        url: string
        title: string
        blank?: boolean
    }
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

interface ScrollMessageData {
    type: 'scroll'
    payload: {
        scrollY: number
        scrollX: number
    }
}

interface RestoreScrollMessageData {
    type: 'restoreScroll'
    payload?: {
        scrollY?: number
        scrollX?: number
    }
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

interface SetTriggerModeMessage {
    type: 'setTriggerMode'
    payload: {
        mode: TriggerMode
        host: string
        customized?: boolean
        activeTabId?: number
    }
}

interface CoverVisibleMessage {
    type: 'coverVisibleChange' | 'setCoverVisible',
    payload: {
        visible: boolean
        tabId?: number
    }
}

interface ViewDocMessage {
    type: 'viewDoc',
    payload: {
        doc: string
    }
}

interface LoadErrorMessage {
    type: 'loadError'
    payload: {
        name: 'link'
        rel: string
        href: string
        url: string
    }
}

interface FallbackLoadErrorMessage {
    type: 'fallbackLoadError',
    payload: {
        name: 'link'
        rel: string
        href: string
        proxy: string
    }
}

interface NoPayloadMessage {
    type: 'closeExplanation'
    | 'closeTranslation'
    | 'DOMContentLoaded'
    | 'load'
    | 'viewLoad'
}

export type CoreMessage =
    | LookUpMessageData
    | RangeRectMessageData
    | TargetPositionMessageData
    | OpenMessageData
    | HistoryStateMessageData
    | TapBlankMessageData
    | TranslateMessageData
    | RefusedDisplayMessageData
    | ScrollMessageData
    | RestoreScrollMessageData
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
    | LoadErrorMessage
    | FallbackLoadErrorMessage
    | NoPayloadMessage

export type MessageType = CoreMessage['type']
