import { Dispatch, RefObject, useEffect } from "react"
import { Action } from '../reducer'
import { MessageData, Dictionary, Translator } from '@wrp/core'
import { contentLoaded } from '../reducer'
import { fallbackLoadError, update } from '../agent'
import { RequestResult } from "../agent/type"
import { NextRouter } from 'next/router'

export type MessageRefData = {
    mount: boolean
    result: RequestResult | null
    router: NextRouter
}

export function useMessage(ref: RefObject<MessageRefData>, dispatch: Dispatch<Action>) {

    useEffect(() => {
        const refData = ref.current
        if (!refData) return

        refData.mount = true
        const lookUp = new Dictionary()
        const translate = new Translator()

        const sendMessage = (
            source: MessageEventSource | null,
            message: MessageData
        ) => {
            source?.postMessage(message, '*' as any)
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {
            const data = e.data
            const source = e.source
            e.data?.type && console.log(e)

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
                    translate
                        .translate(data.text.slice(0, 600))
                        .then((value) => {
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
                    const scrollY = refData.result?.payload?.scrollY
                    sendMessage(source, {
                        type: 'restoreScroll',
                        payload: {
                            scrollY: scrollY,
                        },
                    })
                    break
                case 'viewLoad':
                    const html = refData.result?.html
                    html &&
                        sendMessage(source, {
                            type: 'viewDoc',
                            payload: {
                                doc: html,
                            },
                        })
                    break
                case 'open':
                    !data.payload.blank &&
                        refData.router?.push(
                            '/reading?url=' +
                            encodeURIComponent(data.payload.url)
                        )
                    data.payload.blank &&
                        window.open(data.payload.url, '_blank')
                    break
                case 'scroll':
                    const result = refData.result
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
            const { result } = refData
            if (result) {
                update(result)
            }
        }

        window.addEventListener('message', handleMessage)
        window.addEventListener('blur', handleSave)
        document.addEventListener('visibilitychange', handleSave)

        return () => {
            refData.mount = false
            window.removeEventListener('message', handleMessage)
            window.removeEventListener('blur', handleSave)
            document.removeEventListener('visibilitychange', handleSave)
        }
    }, [])
}
