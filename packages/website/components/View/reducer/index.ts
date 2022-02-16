

export const initialState = {
    loading: false,
    pendingUrl: '',
    url: '',
    favIconUrl: '',
    title: '',
    noScript: false,
}

type State = typeof initialState

export function reducer(state: State, action: any) {
    switch (action.type) {
        default:
            return { ...state }
    }
}