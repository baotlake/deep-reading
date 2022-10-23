
import type { Action } from './action'

type ExplanationStatus = 'loading' | 'success' | 'failed'

export const initialState = {
    position: [0, 0] as [number, number],
    explanationVisible: false,
    explanationStatus: 'loading' as ExplanationStatus,
    wordData: {} as any,
    explanationZIndex: 0,
    translateVisible: false,
    translateData: {} as any,
    translatePosition: null as DOMRect | null,
    mediaCSPViolation: false,
    coverVisible: false,
    anchorUrl: '',
    anchorTitle: '',
    anchorVisible: false,
}

export type State = typeof initialState

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'setState':
            return { ...state, ...action.payload }
        default:
            return { ...state }
    }
}