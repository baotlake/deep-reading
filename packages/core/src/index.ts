import {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
} from './core'
import {
    PostMessageType,
    ReceiveMessageType,
    MessageData,
} from './types/message'
import LookUp from './LookUp'
import { WordData } from './types/wrp'
import Translator from './Translator'
import noScript from './dom/noScript'
import ReadingHistory, { ReadingHistoryItem } from './ReadingHistory'
import DocProxy, { DocData } from './DocProxy'

export {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
    PostMessageType as MessageType,
    ReceiveMessageType as PostMessageType,
    LookUp,
    Translator,
    noScript,
    ReadingHistory,
    DocProxy,

}
export type {
    MessageData,
    ReadingHistoryItem,
    WordData,
    DocData,
    
}
