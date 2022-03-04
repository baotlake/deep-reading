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
export { ReadHistory as ReadingHistory } from './ReadHistory'
export { ReadHistory } from './ReadHistory'
// export { DocProxy } from './DocProxy'

export { open as openDB } from './db'

export { setSetting, getSetting } from './setting'

export type {
    MessageData,
    WordData,
    MessageType,
    TriggerMode,
} from './types'

export { detectRefusedDisplay, detectCSP } from './core'




