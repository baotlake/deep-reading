import { createContext, Dispatch } from "react"

import { initialState } from './reducer'

export const ViewContext = createContext({
    state: initialState,
    dispatch: null as null | Dispatch<any>
})