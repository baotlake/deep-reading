import type { RequestResult } from '../type'

type Toogle = 'auto' | 'allow' | 'block'

type Options = {
    script?: Toogle
    sameOrigin?: Toogle
}

export function setOptions(result: RequestResult, options?: Options) {
    if (result && result.payload && options) {
        const noScript = options.script !== 'allow'
        const allowSameOrigin = options.sameOrigin === 'allow'

        result.payload.noScript = noScript
        result.payload.allowSameOrigin = allowSameOrigin
    }

    return result
}