
import type { Action } from './action'

type ExplanationStatus = 'loading' | 'success' | 'failed'

export const initialState = {
    position: [0, 0] as [number, number],
    explanationVisible: false,
    explanationStatus: 'loading' as ExplanationStatus,
    explanationOutbound: false,
    wordData: {} as any,
    explanationZIndex: 0,
    translateVisible: false,
    translateData: {} as any,
    translatePosition: null as DOMRect | null,
    translateOutbound: false,
    mediaCSPViolation: false,
    coverVisible: false,
    anchorUrl: '',
    anchorTitle: '',
    anchorVisible: false,
    anchorElement: null as null | HTMLAnchorElement,
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