
import type { Action } from './actions'

// type Toggle = 'auto' | 'allow' | 'block'

export const initialState = {
    initialized: false,
    loading: false,
    loaded: true,
    pendingUrl: '',
    url: '',
    favicon: '',
    title: '',

    frameSrc: process.env.VIEW_SRC,
    frameKey: 0,
    noScript: true,

    allowScript: false,
    allowSameOrigin: false,
    readerMode: false,

    options: {
        autoReaderMode: true,
        autoAllowScript: true,
        autoAllowSameOrigin: true,

        readerMode: 0,
        allowScript: 0,
        allowSameOrigin: 0,
    }
}

export type State = typeof initialState

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'initialize':
        case 'open':
            return {
                ...state, ...action.payload, options: {
                    ...state.options,
                    ...action.payload.options
                }
            }
        case 'setState':
            return { ...state, ...action.payload }
        case 'setOptions':
            return { ...state, options: { ...state.options, ...action.payload } }
        default:
            return { ...state }
    }
}
