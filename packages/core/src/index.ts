export {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
    abstract,
    isArticleContent,
} from './core'

export { Dictionary } from './Dictionary'
export { Translator } from './Translator'
export { noScript } from './utils/noScript'
export { TouchGesture } from './utils/touch'
export { ReadingHistory } from './ReadingHistory'
export { DocProxy } from './DocProxy'

export type {
    MessageData,
    WordData,
    MessageType,
    TriggerMode,
} from './types'

export { detectRefusedDisplay, detectCSP } from './core'




