import type { RequestResult } from "../agent/type"
import type { initialState } from '../reducer'

type State = typeof initialState
type Toggle = State['options']['script']

type ActionType = 'initialize' | 'open'

interface ActionInterface<T = any> {
    type: ActionType
    payload: T
}

export function initialize(options: Partial<State['options']>): ActionInterface {
    return {
        type: 'initialize',
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
        type: 'open',
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
        type: 'docLoaded',
        payload: {
            loading: false,
            url: url,
            favicon: payload?.favicon,
            title: payload?.title,
            frameSrc: src,
            frameKey: Date.now(),
            noScript: payload?.noScript,
            allowSameOrigin: payload?.allowSameOrigin,
        }
    }
}

export function contentLoaded() {
    return {
        type: 'contentLoaded',
        payload: {
            loaded: true,
        }
    }
}

export function setScript(value: Toggle) {

    return {
        type: 'setOptions',
        payload: {
            script: value,
        }
    }
}

export function setSameOrigin(value: Toggle) {
    return {
        type: 'setOptions',
        payload: {
            sameOrigin: value,
        }
    }
}

type Actions = typeof initialize
    | typeof open
    | typeof docLoaded
    | typeof contentLoaded
    | typeof setScript
    | typeof setSameOrigin


export type Action = ReturnType<Actions>