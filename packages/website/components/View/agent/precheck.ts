import { optionsPolicy } from './options'
import { isSomeHost } from '../utils/utils'
import { eq, pick } from 'lodash-es'
import type { State } from '../reducer'
import type { RequestResult } from './type'

type Options = State['options']

export function precheck(url: string, options: Options, preUrl: string): [string, Options] {
    const someHost = isSomeHost(url, preUrl)

    if (!someHost) {
        options = {
            ...options,
            allowSameOrigin: options.autoAllowSameOrigin ? '' : options.allowSameOrigin,
            allowScript: options.autoAllowScript ? '' : options.allowScript,
            readerMode: options.autoReaderMode ? '' : options.readerMode,
        }
    }

    return [url, options]
}

export function reloadPrecheck(result: RequestResult, options: Options) {
    if (!options) return false
    if (!result.payload) return false
    if (!result.options) return false
    if (eq(result.options, options)) return false

    const policy = optionsPolicy(options)
    const oldPolicy = pick(result.payload, ['allowScript', 'allowSameOrigin', 'readerMode'])

    if (eq(oldPolicy, policy)) return false
    return true
}