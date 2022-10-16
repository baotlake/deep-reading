import { Action } from './action'

type Tab = chrome.tabs.Tab

export const initialState = {
    popup: {
        visible: false,
    },
    tab: null as Tab,
}

type State = typeof initialState

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'showContentPopup':
            return {
                ...state,
                ...action.payload,
                popup: { ...state.popup, ...action.payload.popup },
            }
        case 'popupVisible':
            return { ...state, popup: { ...state.popup, ...action.payload } }
        default:
            return state
    }
}
