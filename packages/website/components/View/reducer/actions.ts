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

export function open(url: string) {
    return {
        type: 'open' as 'open',
        payload: {
            loading: true,
            loaded: false,
            pendingUrl: url,
            favIconUrl: '',
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

export function setScript(auto: boolean, opinion: Opinion) {

    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            autoAllowScript: auto,
            allowScript: opinion,
        }
    }
}

export function setSameOrigin(auto: boolean, opinion: Opinion) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            autoAllowSameOrigin: auto,
            allowSameOrigin: opinion,
        }
    }
}

export function setReaderMode(auto: boolean, opinion: Opinion) {
    return {
        type: 'setOptions' as 'setOptions',
        payload: {
            autoReaderMode: auto,
            readerMode: opinion,
        }
    }
}

type Actions = typeof initialize
    | typeof open
    | typeof docLoaded
    | typeof contentLoaded
    | typeof setScript
    | typeof setSameOrigin
    | typeof setReaderMode


export type Action = ReturnType<Actions>