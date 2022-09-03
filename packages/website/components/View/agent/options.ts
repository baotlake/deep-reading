
import type { State } from '../reducer'

type Options = State['options']

export function optionsPolicy(options: Options) {
    const allowScript = options.allowScript === 'y' || false
    const allowSameOrigin = options.allowSameOrigin === 'y' || false
    const readerMode = options.readerMode === 'y' || false

    return {
        allowScript,
        allowSameOrigin,
        readerMode,
    }
}