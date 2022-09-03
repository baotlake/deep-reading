
import type { RootState } from "./reducer"


export function setReading(options: RootState['reading']) {
    return {
        type: 'setReading' as 'setReading',
        payload: options,
    }
}

export type Action =
    | ReturnType<typeof setReading>