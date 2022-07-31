/// <reference path="../../../module.d.ts" />

import { useEffect, useMemo, useReducer, useRef } from 'react'
import { NextRouter, useRouter } from 'next/router'
import {
    MessageData,
    Dictionary,
    Translator,
} from '@wrp/core'
import classNames from 'classnames'
import type { RequestResult } from '../agent/type'
import { request, fallbackLoadError, update } from '../agent'
import { initialState, reducer, open, docLoaded, contentLoaded } from '../reducer'
import { ViewContext } from '../ViewContext'
import { Control } from '../Control'
import { useInitialize } from '../hooks'

import { ViewWrapper, IframeWrapper, Ifrmae } from './index.style'

type Props = {
    active?: boolean
}

export default function View({ active }: Props) {
    const iframeEl = useRef<HTMLIFrameElement>(null)
    const router = useRouter()
    const [state, dispatch] = useReducer(reducer, initialState)

    useInitialize(dispatch)

    const dataRef = useRef({
        mount: false,
        result: null as null | RequestResult,
        queryUrl: 'null',
        router: null as any as NextRouter,
        options: state.options,

        // test
        docRenderTime: 0,
        lastMessageTime: 0,
    })

    useMemo(() => {
        dataRef.current.router = router
        dataRef.current.options = state.options
    }, [state.options, router])


    useEffect(() => {
        dataRef.current.mount = true
        const lookUp = new Dictionary()
        const translate = new Translator()

        const sendMessage = (source: MessageEventSource | null, message: MessageData) => {
            source?.postMessage(message, '*' as any)
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {
            const data = e.data
            const source = e.source
            e.data?.type && console.log(e)
            dataRef.current.lastMessageTime = Date.now()

            data.type && console.log('Frame View m: ', data)
            switch (data.type) {
                case 'lookUp':
                    lookUp.search(data.text).then((value) => {
                        console.log('lookup result', value)
                        sendMessage(source, {
                            type: 'lookUpResult',
                            data: value as any,
                        })
                    })
                    break
                case 'translate':
                    translate.translate(data.text).then((value) => {
                        console.log('translate result', value)
                        sendMessage(source, {
                            type: 'translateResult',
                            data: value,
                        })
                    })
                    break
                case 'playPronunciation':
                    const audio = new Audio(data.data.url)
                    audio.play()
                    break
                case 'DOMContentLoaded':
                case 'load':
                    dispatch(contentLoaded())
                    const scrollY = dataRef.current.result?.payload?.scrollY
                    sendMessage(source, {
                        type: 'restoreScroll',
                        payload: {
                            scrollY: scrollY,
                        }
                    })
                    break
                case 'viewLoad':
                    const html = dataRef.current.result?.html
                    html && sendMessage(source, {
                        type: 'viewDoc',
                        payload: {
                            doc: html
                        }
                    })
                    break
                case 'open':
                    !data.payload.blank && dataRef.current.router?.push('/reading?url=' + encodeURIComponent(data.payload.url))
                    data.payload.blank && window.open(data.payload.url, '_blank')
                    break
                case 'scroll':
                    const result = dataRef.current.result
                    if (result && data.payload) {
                        result.payload.scrollY = data.payload.scrollY
                    }
                    break
                case 'refusedDisplay':
                    // renderDoc({ noScript: true })
                    break
                case 'summary':
                    // readHistory
                    //     .push({
                    //         ...data.summary,
                    //         href: dataRef.current?.result?.url
                    //     })
                    //     .then(() => {
                    //         readHistory.get(5)
                    //     })
                    break

                case 'loadError':
                    fallbackLoadError(data).then((message) => {
                        message && sendMessage(source, message)
                    })
                    break
            }
        }

        const handleSave = () => {
            const { result } = dataRef.current
            if (result) {
                update(result)
            }
        }

        window.addEventListener('message', handleMessage)
        window.addEventListener('blur', handleSave)
        document.addEventListener('visibilitychange', handleSave)

        return () => {
            dataRef.current.mount = false
            window.removeEventListener('message', handleMessage)
            window.removeEventListener('blur', handleSave)
            document.removeEventListener('visibilitychange', handleSave)
        }
    }, [])

    useEffect(() => {
        const urls = router.query.url
        const url = typeof urls === 'string' ? urls : urls ? urls[0] : ''

        const { queryUrl, result } = dataRef.current
        const go = state.initialized && active && url !== queryUrl
        console.log('go: ', go, 'url', url, 'queryUrl: ', queryUrl)

        if (result) {
            update(result)
        }

        if (go) {
            dataRef.current.queryUrl = url
            dispatch(open(url))
            const options = dataRef.current.options
            request(url, options).then((result) => {
                const { mount, queryUrl: currentUrl } = dataRef.current
                if (!mount || currentUrl !== url) {
                    return
                }
                dataRef.current.result = result
                dispatch(docLoaded(result))
            })
        }

        return () => {

        }
    }, [state.initialized, active, router.query])


    useEffect(() => {
        let fresh = true
        const { result } = dataRef.current
        if (state.initialized && result) {
            dispatch(open(result.url))
            request(result.url, state.options).then((result) => {
                if (!fresh) return
                dataRef.current.result = result
                dispatch(docLoaded(result))
            })
        }
        return () => {
            fresh = false
        }
    }, [state.initialized, state.options])

    useEffect(() => {
        const { current: iframe } = iframeEl
        if (active !== false && iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
                {
                    type: 'restoreScroll',
                },
                '*'
            )
        }
    }, [router.route, active])

    return (
        <ViewWrapper>
            <IframeWrapper>
                <Ifrmae
                    title="Deep Reading Content View"
                    key={state.frameKey}
                    src={state.frameSrc}
                    ref={iframeEl}
                    referrerPolicy="no-referrer"
                    sandbox={classNames(
                        "allow-scripts allow-forms allow-popups", {
                        "allow-same-origin": state.options.sameOrigin === 'allow'
                    })}
                />
                <ViewContext.Provider
                    value={{ state: state, dispatch: dispatch }}
                >
                    <Control />
                </ViewContext.Provider>
            </IframeWrapper>
        </ViewWrapper>
    )
}
