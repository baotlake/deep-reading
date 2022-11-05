import type { RequestResult } from "../agent/type"
import type { State } from '../reducer'

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
        type: 'setState' as 'setState',
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
        type: 'setState' as 'setState',
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
        type: 'setState' as 'setState',
        payload: {
            loaded: true,
        }
    }
}

export function setFrameKey(key: number) {
    return {
        type: 'setState' as 'setState',
        payload: {
            frameKey: key,
        }
    }
}

export function setScript(value: number, auto?: boolean) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            allowScript: value,
            ...(typeof auto === 'boolean' ? { autoAllowScript: auto } : {})
        }
    }
}

export function setSameOrigin(value: number, auto?: boolean) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            allowSameOrigin: value,
            ...(typeof auto === 'boolean' ? { autoAllowSameOrigin: auto } : {})
        }
    }
}

export function setReaderMode(value: number, auto?: boolean) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            readerMode: value,
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
    | typeof setFrameKey


export type Action = ReturnType<Actions>