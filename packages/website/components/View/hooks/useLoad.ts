import { Dispatch, RefObject } from 'react'
import { Action, open, docLoaded } from '../reducer'
import { useRouter } from 'next/router'
import { precheck } from '../agent'
import { Options, RequestResult } from '../agent/type'
import { request } from '../agent'
import { isEqual } from 'lodash-es'
import { isSomeHost } from '../utils/utils'
import { optionsPolicy } from '../agent/options'
import { NextRouter } from 'next/router'

export type LoadRefData = {
    url: string
    pendingId: number
    pendingOptions: null | Options
    pendingUrl: string
    result: null | RequestResult
    options: Options
    active: boolean
    initialized: boolean
}

export function useLoad(
    ref: RefObject<LoadRefData>,
    dispatch: Dispatch<Action>
) {
    const router = useRouter()

    const { url, r, s, o } = router.query

    const href = Array.isArray(url) ? url[0] : url ? url : ''
    const readerMode = parseInt(Array.isArray(r) ? r[0] : r ? r : '0')
    const allowScript = parseInt(Array.isArray(s) ? s[0] : s ? s : '0')
    const allowSameOrigin = parseInt(Array.isArray(o) ? o[0] : o ? o : '0')

    do {
        if (!ref.current) break
        const {
            options: memoOptions,
            result: preResult,
            initialized,
            active,
            pendingUrl,
            pendingOptions,
        } = ref.current

        if (!initialized) break
        if (!active) break

        const options: Options = {
            ...memoOptions,
            readerMode,
            allowScript,
            allowSameOrigin,
        }

        const [newHref, newOptions, load] = precheck(href, options, preResult)
        if (!load) break
        if (pendingUrl === newHref && isEqual(pendingOptions, newOptions)) break
        if (
            pendingOptions &&
            pendingUrl === newHref &&
            isEqual(optionsPolicy(options), optionsPolicy(pendingOptions))
        ) {
            break
        }

        console.log(
            'useLoad load: ',
            newHref,
            pendingUrl,
            newHref === pendingUrl,
            newOptions,
            pendingOptions,
            isEqual(pendingOptions, newOptions),
            'load',
            load
        )

        const pendingId = Date.now()
        ref.current.pendingUrl = newHref
        ref.current.pendingOptions = newOptions
        ref.current.pendingId = pendingId

        dispatch(open(newHref, newOptions))

        request(newHref, newOptions).then((result) => {
            console.log('useLoad', result)
            if (!ref.current) return
            if (pendingId !== ref.current.pendingId) return

            ref.current.pendingId = 0
            ref.current.result = result
            ref.current.url = newHref
            dispatch(docLoaded(result))

            if (result.options) {
                const { readerMode: r, allowScript: s, allowSameOrigin: o } = result.options
                router.replace({ query: { ...router.query, r, s, o } })
            }
        })
    } while (false)
}
