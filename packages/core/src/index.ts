export {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
} from './core'
export {
    MessageType,
    MessageData,
} from './types/message'

export { WordData } from './types/wrp'
export { Dictionary } from './Dictionary'
export { Translator } from './Translator'
export { noScript } from './utils/noScript'
export { ReadingHistory, ReadingHistoryItem } from './ReadingHistory'
export { DocProxy, DocData } from './DocProxy'

export {
    sendContentMessage, addContentMessageListener,
    startExtensionContent,
    removeExtensionContent,
} from './content'


