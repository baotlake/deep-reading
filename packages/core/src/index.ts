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
import LookUp from './LookUp'
import { WordData } from './types/wrp'
import Translate from './Translate'
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
    Translate,
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
