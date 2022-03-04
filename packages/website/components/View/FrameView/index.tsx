/// <reference path="../../../module.d.ts" />

import { useEffect, useReducer, useRef, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import {
    MessageData,
    ReadingHistory,
    Dictionary,
    Translator,
    getSetting,
} from '@wrp/core'
import classNames from 'classnames'
import type { RequestResult } from '../agent/type'
import { request } from '../agent'
import { initialState, reducer, open, docLoaded, contentLoaded } from '../reducer'
import { ViewContext } from '../ViewContext'
import { Control } from '../Control'
import { useInitialize } from '../hooks'

import style from './index.module.scss'

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
        noScript: false,

        docRenderTime: 0,
        lastMessageTime: 0,
        router: null as any as NextRouter,
    })

    dataRef.current.router = router
    dataRef.current.noScript = state.noScript

    useEffect(() => {
        dataRef.current.mount = true
        const readingHistory = new ReadingHistory()
        const lookUp = new Dictionary()
        const translate = new Translator()

        const sendMessage = (source: MessageEventSource | null, message: any) => {
            source?.postMessage(message, '*' as any)
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {
            const data = e.data
            const source = e.source
            e.data?.type && console.log(e)
            dataRef.current.lastMessageTime = Date.now()

            data.type && console.log('Frame View m: ', data)
            switch (data.type) {
                case 'refusedDisplay':
                    // renderDoc({ noScript: true })
                    break
                case 'summary':
                    readingHistory
                        .push({
                            ...data.summary,
                            href: dataRef.current?.result?.url
                        })
                        .then(() => {
                            readingHistory.get(5)
                        })
                    break
                case 'open':
                    !data.blank && dataRef.current.router?.push('/reading?url=' + encodeURIComponent(data.href))
                    data.blank && window.open(data.href, '_blank')
                    break
                case 'lookUp':
                    lookUp.search(data.text).then((value) => {
                        console.log('lookup result', value)
                        sendMessage(source, {
                            type: 'lookUpResult',
                            data: value,
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
                    break
            }
        }
        window.addEventListener('message', handleMessage)

        return () => {
            dataRef.current.mount = false
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        const urls = router.query.url
        const url = typeof urls === 'string' ? urls : urls ? urls[0] : ''
        const { queryUrl } = dataRef.current
        console.log('url: ', url, router.route, router.query)

        const go = state.initialized && active !== false && url !== queryUrl


        if (go) {
            dispatch(open(url))
            const noScript = state.options.script === 'block'
            request(url, { noScript: noScript }).then((result) => {
                dataRef.current.result = result
                dispatch(docLoaded(result))
            })
        }

        return () => {
            if (go) {
                dataRef.current.queryUrl = url
            }
        }
    }, [router.query, active, state.initialized, state.options])


    useEffect(() => {
        let current = true
        const { result } = dataRef.current
        if (state.initialized && result) {
            dispatch(open(result.url))
            const noScript = state.options.script === 'block'
            request(result.url, { noScript: noScript }).then((result) => {
                if (!current) return
                dataRef.current.result = result
                dispatch(docLoaded(result))
            })
        }
        return () => {
            current = false
        }
    }, [state.initialized, state.options.script])

    useEffect(() => {
        const { result } = dataRef.current
        if (state.initialized && result) {
            dispatch(docLoaded(result))
        }
    }, [state.initialized, state.options.sameOrigin])

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

    useEffect(() => {
        return () => {
            console.log('Revoke Frame src url')
            URL.revokeObjectURL(state.frameSrc)
        }
    }, [state.frameSrc])

    return (
        <div className={style['view-root']}>
            <div className={style['container']}>
                <iframe
                    title="Content View"
                    src={state.frameSrc}
                    ref={iframeEl}
                    referrerPolicy="no-referrer"
                    // sandbox="allow-scripts allow-forms allow-same-origin"
                    sandbox={classNames(
                        "allow-scripts allow-forms", {
                        "allow-same-origin": state.options.sameOrigin === 'allow'
                    })}
                    style={{
                        borderWidth: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />

                <ViewContext.Provider
                    value={{ state: state, dispatch: dispatch }}
                >
                    <Control />
                </ViewContext.Provider>
            </div>
        </div>
    )
}
