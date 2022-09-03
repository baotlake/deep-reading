import type { RequestResult } from "../agent/type"
import type { State } from '../reducer'

type Opinion = State['options']['readerMode']

export function initialize(options: Partial<State['options']>) {
    return {
        type: 'initialize' as 'initialize',
        payload: {
            initialized: true,

            options: {
                ...options
            }
        }
    }
}

export function open(url: string, options?: Partial<State['options']>) {
    return {
        type: 'open' as 'open',
        payload: {
            loading: true,
            loaded: false,
            pendingUrl: url,
            favIconUrl: '',

            options: {
                ...options,
            }
        }
    }
}

export function reloadAction() {
    return {
        type: 'reload' as 'reload',
        payload: {
            loading: true,
            loaded: false,
        }
    }
}

export function docLoaded(result: RequestResult) {
    const { url, payload } = result
    const src = process.env.VIEW_SRC

    return {
        type: 'docLoaded' as 'docLoaded',
        payload: {
            loading: false,
            url: url,
            favicon: payload?.favicon,
            title: payload?.title,
            frameSrc: src,
            frameKey: Date.now(),

            allowScript: payload?.allowScript,
            allowSameOrigin: payload?.allowSameOrigin,
            readerMode: payload?.readerMode,
        }
    }
}

export function contentLoaded() {
    return {
        type: 'contentLoaded' as 'contentLoaded',
        payload: {
            loaded: true,
        }
    }
}

export function setScript(opinion: Opinion, auto?: boolean) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            allowScript: opinion,
            ...(typeof auto === 'boolean' ? { autoAllowScript: auto } : {})
        }
    }
}

export function setSameOrigin(opinion: Opinion, auto?: boolean) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            allowSameOrigin: opinion,
            ...(typeof auto === 'boolean' ? { autoAllowSameOrigin: auto } : {})
        }
    }
}

export function setReaderMode(opinion: Opinion, auto?: boolean) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            readerMode: opinion,
            ...(typeof auto === 'boolean' ? { autoReaderMode: auto } : {})
        }
    }
}

type Actions = typeof initialize
    | typeof open
    | typeof reloadAction
    | typeof docLoaded
    | typeof contentLoaded
    | typeof setScript
    | typeof setSameOrigin
    | typeof setReaderMode


export type Action = ReturnType<Actions>