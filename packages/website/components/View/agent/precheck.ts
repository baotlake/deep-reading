import { optionsPolicy } from './options'
import { isSomeHost } from '../utils/utils'
import { isEqual, pick } from 'lodash-es'
import type { State } from '../reducer'
import type { RequestResult } from './type'

type Options = State['options']

export function precheck(
    url: string,
    options: Options,
    preResult: RequestResult | null
): [string, Options, boolean] {
    const hasPreResult =
        preResult && preResult.url && preResult.options && preResult.payload
    const preOptions = preResult?.options || options
    const preUrl = preResult ? preResult.url : ''
    const someHost = hasPreResult && isSomeHost(url, preUrl)
    const eqPolicy =
        preResult &&
        preResult.options &&
        isEqual(optionsPolicy(options), optionsPolicy(preResult.options))

    const load = url !== preUrl || !eqPolicy

    if (load && someHost) {
        if (options.allowSameOrigin === 0) {
            options.allowSameOrigin = preOptions.allowSameOrigin
        }
        if (options.allowScript === 0) {
            options.allowScript = preOptions.allowScript
        }
        if (options.readerMode === 0) {
            options.readerMode = preOptions.readerMode
        }
    }

    return [url, options, load]
}

function oldPrecheck(
    url: string,
    options: Options,
    preUrl: string
): [string, Options] {
    const someHost = isSomeHost(url, preUrl)

    if (!someHost) {
        options = {
            ...options,
            allowSameOrigin: options.autoAllowSameOrigin
                ? 0
                : options.allowSameOrigin,
            allowScript: options.autoAllowScript ? 0 : options.allowScript,
            readerMode: options.autoReaderMode ? 0 : options.readerMode,
        }
    }

    return [url, options]
}

function reloadPrecheck(result: RequestResult, options: Options) {
    if (!options) return false
    if (!result.payload) return false
    if (!result.options) return false
    if (isEqual(result.options, options)) return false

    const policy = optionsPolicy(options)
    const oldPolicy = pick(result.payload, [
        'allowScript',
        'allowSameOrigin',
        'readerMode',
    ])

    if (isEqual(oldPolicy, policy)) return false
    return true
}
