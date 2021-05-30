import {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
} from './core'

import { PostMessageType, MessageData } from './content/type'

import LookUp from './LookUp'

export {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
    PostMessageType as MessageType,
    LookUp,
}

export type { MessageData }
