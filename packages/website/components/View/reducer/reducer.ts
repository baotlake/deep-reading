
import type { Action } from './actions'

type Toggle = 'auto' | 'allow' | 'block'

export const initialState = {
    initialized: false,
    loading: false,
    loaded: true,
    pendingUrl: '',
    url: '',
    favicon: '',
    title: '',

    frameSrc: '',
    frameKey: 0,
    noScript: false,
    allowSameOrigin: false,

    options: {
        script: 'auto' as Toggle,
        sameOrigin: 'auto' as Toggle,
    }
}

export type State = typeof initialState

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'initialize':
            return {
                ...state, ...action.payload, options: {
                    ...state.options,
                    ...action.payload.options
                }
            }
        case 'open':
            return { ...state, ...action.payload }
        case 'docLoaded':
            return { ...state, ...action.payload }
        case 'contentLoaded':
            return { ...state, ...action.payload }
        case 'setOptions':
            return { ...state, options: { ...state.options, ...action.payload } }
        default:
            return { ...state }
    }
}
