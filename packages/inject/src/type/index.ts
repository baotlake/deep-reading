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

interface LookupRangeMessage {
    type: 'lookupRange'
    payload: {
        range: Range
    }
}

interface TranslateRangeMessage {
    type: 'translateRange'
    payload: {
        range: Range
    }
}

interface AnchorMessage {
    type: 'anchor'
    payload: {
        element: HTMLAnchorElement
        url: string
        title: string
    }
}

type Message =
    | TapWordMessage
    | LookupRangeMessage
    | TranslateRangeMessage
    | AnchorMessage

export type InjectMessage = CoreMessage | Message

export type Action = 'lookup' | 'translate' | 'link'

export interface TransformDiv extends HTMLDivElement {
    transform?: (x: number, y: number) => void
}

export type MarkPreffix = 'dr-highlight-'
