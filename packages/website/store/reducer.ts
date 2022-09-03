
import type { Action } from './actions'

export const initialState = {
    reading: {
        plus: false,
    },
}


export type RootState = typeof initialState


export function reducer(state: RootState, action: Action) {
    switch (action.type) {
        case 'setReading':
            return { ...state, reading: { ...state.reading, ...action.payload } }
        default:
            return { ...state }
    }
}
