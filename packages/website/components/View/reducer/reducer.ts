

export const initialState = {
    loading: false,
    loaded: true,
    pendingUrl: '',
    url: '',
    favicon: '',
    title: '',

    frameSrc: '',
    options: {
        noScript: false,
    }
}

type State = typeof initialState

export function reducer(state: State, action: any): State {
    switch (action.type) {
        case 'open':
            return { ...state, ...action.payload }
        case 'docLoaded':
            return { ...state, ...action.payload }
        case 'contentLoaded':
            return { ...state, ...action.payload }
        default:
            return { ...state }
    }
}
