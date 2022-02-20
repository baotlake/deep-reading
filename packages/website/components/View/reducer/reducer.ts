

export const initialState = {
    loading: false,
    pendingUrl: '',
    url: '',
    favIconUrl: '',
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
        case 'loaded':
            return { ...state, ...action.payload }
        default:
            return { ...state }
    }
}
