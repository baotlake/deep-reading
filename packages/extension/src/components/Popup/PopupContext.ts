import { createContext, Dispatch } from 'react'
import { initialState } from './reducer'
import type { Action } from './reducer'


export const PopupContext = createContext({ state: initialState, dispatch: null as null | Dispatch<Action> })

export default PopupContext