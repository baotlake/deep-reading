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

type InjectOnlyMessage = TapWordMessage
export type InjectMessage = CoreMessage | InjectOnlyMessage
