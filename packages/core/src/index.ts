import {
    MessageType as MessageType_,
} from './types'

export {
    extractWordRange,
    extractSentenceRange,
    getTargetByPoint,
} from './core'

export { Dictionary } from './Dictionary'
export { Translator } from './Translator'
export { noScript } from './utils/noScript'
export { ReadingHistory } from './ReadingHistory'
export { DocProxy } from './DocProxy'

export {
    sendMessage,
    addMessageListener,
    sendContentMessage,
    addContentMessageListener,
    startExtensionContent,
    removeExtensionContent,
} from './content'

// export { App } from './App'

export type {
    MessageData,
    WordData,
} from './types'

export { detectRefusedDisplay, detectCSP } from './core'


export const MessageType = MessageType_

// export {
//     MessageType,
//     MessageData,
//     WordData,
// }



