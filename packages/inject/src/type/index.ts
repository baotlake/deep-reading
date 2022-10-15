import type { CoreMessage } from '@wrp/core'

export interface PageRect extends DOMRect {
    scrollX: number
    scrollY: number
}

interface TapWordMessage {
    type: 'tapWord'
    payload: {
        text: string
        position: DOMRect
        element: Element
    }
}

type Message = TapWordMessage
export type InjectMessage = CoreMessage | Message
