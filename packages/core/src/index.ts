import {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
} from './core'
import {
    PostMessageType,
    ReceiveMessageType,
    MessageData,
} from './injection/type'
import LookUp, { WordData} from './LookUp'
import Translate from './Translate'
import noScript from './dom/noScript'
import ReadingHistory, { ReadingHistoryItem } from './ReadingHistory'
import DocProxy from './DocProxy'

export {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
    PostMessageType as MessageType,
    ReceiveMessageType as PostMessageType,
    LookUp,
    Translate,
    noScript,
    ReadingHistory,
    DocProxy,
}
export type {
    MessageData,
    ReadingHistoryItem,
    WordData,
    
}
