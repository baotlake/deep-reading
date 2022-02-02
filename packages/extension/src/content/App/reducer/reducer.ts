import { Action } from './action'

export const initialState = {
    popup: {
        visible: false,
    }
}

type State = typeof initialState


export function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'popupVisible':
            return { ...state, popup: { ...state.popup, ...action.payload } }
        default:
            return state
    }
}