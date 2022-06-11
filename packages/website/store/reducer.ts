
export const initialState = {
    
}


export type RootState = typeof initialState


export function reducer(state: RootState, action: any) {
    switch (action.type) {
        default:
            return { ...state }
    }
}
