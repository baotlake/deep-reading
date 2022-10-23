import type { State } from "./reducer"

export function setState(state: Partial<State>) {
    return {
        type: 'setState' as 'setState',
        payload: {
            ...state,
        }
    }
}

type ActionFunction = typeof setState

export type Action = ReturnType<ActionFunction>
