import { createContext } from "react"

import { initialState } from './reducer'

export const ViewContext = createContext({
    state: initialState,
    dispatch: null
})