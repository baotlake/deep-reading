import { createContext, Dispatch } from "react"
import { initialState, RootState } from "./reducer"
import type { Action } from "./actions"


type ContextType = { state: RootState, dispatch: null | Dispatch<Action> }

export const RootContext = createContext<ContextType>({ state: initialState, dispatch: null })
