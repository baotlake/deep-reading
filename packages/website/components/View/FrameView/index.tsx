/// <reference path="../../../module.d.ts" />

import { useEffect, useReducer, useRef } from 'react'
import { NextRouter, useRouter } from 'next/router'
import {
    MessageData,
    Dictionary,
    Translator,
} from '@wrp/core'
import classNames from 'classnames'
import type { RequestResult } from '../agent/type'
import { request, reload, fallbackLoadError, update, precheck, reloadPrecheck } from '../agent'
import { initialState, reducer, open, reloadAction, docLoaded, contentLoaded, setReaderMode, setScript, setSameOrigin } from '../reducer'
import { ViewContext } from '../ViewContext'
import { Control } from '../Control'
import { Share } from '../Share'
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
        pendingUrl: '',
        // 用于比较URL避免重复加载，设为 'null' 是为了方便第一次加载空白页面
        url: 'null',
        router: null as any as NextRouter,
        options: state.options,

        // test
        docRenderTime: 0,
        lastMessageTime: 0,
    })

    dataRef.current.router = router
    dataRef.current.options = state.options

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
                    translate.translate(data.text.slice(0, 600)).then((value) => {
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
        const current = dataRef.current
        const options = current.options
        const urls = router.query.url
        const url = typeof urls === 'string' ? urls : urls ? urls[0] : ''

        const go = state.initialized && active && url !== current.url
        console.log('go: ', go, 'url', url, 'queryUrl: ', current.url)

        if (!go) return () => { }

        if (current.result) {
            update(current.result)
        }

        const [newUrl, newOptions] = precheck(url, options, current.url)
        current.pendingUrl = newUrl
        dispatch(open(newUrl, newOptions))
        request(newUrl, newOptions).then((result) => {
            if (!current.mount || current.pendingUrl !== newUrl) {
                return
            }
            current.result = result
            current.url = newUrl
            dispatch(docLoaded(result))
        })

        return () => { }
    }, [state.initialized, active, router.query])


    useEffect(() => {
        let fresh = true
        const { result, pendingUrl } = dataRef.current
        if (!state.initialized || !result) return
        if (pendingUrl !== result.url) return

        const shoudReload = reloadPrecheck(result, state.options)
        if (!shoudReload) return

        dispatch(reloadAction())
        reload(result, state.options).then((result) => {
            if (!fresh) return
            dataRef.current.result = result
            dispatch(docLoaded(result))
        })

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
                    {/* <Share /> */}
                </ViewContext.Provider>
            </IframeWrapper>
        </ViewWrapper>
    )
}
