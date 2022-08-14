
import type { Action } from './actions'

type Toggle = 'auto' | 'allow' | 'block'
type Opinion = '' | 'y' | 'n'

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
        script: 'auto' as Toggle,
        sameOrigin: 'auto' as Toggle,

        autoReaderMode: true,
        autoAllowScript: true,
        autoAllowSameOrigin: true,

        readerMode: '' as Opinion,
        allowScript: '' as Opinion,
        allowSameOrigin: '' as Opinion,
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
