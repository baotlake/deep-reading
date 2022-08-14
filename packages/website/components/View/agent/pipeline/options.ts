import type { RequestResult } from '../type'
import type { State } from '../../reducer'

type Options = State['options']

export function setOptions(result: RequestResult, options?: Options) {
    if (result && result.payload && options) {

        const allowScript = options.allowScript === 'y' || false
        const allowSameOrigin = options.allowSameOrigin === 'y' || false
        const readerMode = options.readerMode === 'y' || false

        result.payload.allowScript = allowScript
        result.payload.allowSameOrigin = allowSameOrigin
        result.payload.readerMode = readerMode
    }

    return result
}