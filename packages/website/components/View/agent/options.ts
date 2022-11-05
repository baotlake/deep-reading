
import type { State } from '../reducer'

type Options = State['options']

export function optionsPolicy(options: Options) {
    const allowScript = options.allowScript > 0
    const allowSameOrigin = options.allowSameOrigin > 0
    const readerMode = options.readerMode > 0

    return {
        allowScript,
        allowSameOrigin,
        readerMode,
    }
}