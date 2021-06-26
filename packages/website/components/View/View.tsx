/// <reference path="../../module.d.ts" />

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { noScript } from '@wrp/core'
import {
    ReadingHistory,
    MessageType,
    PostMessageType,
    MessageData,
    DocProxy,
} from '@wrp/core'
import contentScript from '@wrp/core/dist/injection.js?raw'
import style from './view.module.scss'

export default function View() {
    const docProxy = useRef<DocProxy>()
    const iframe = useRef<HTMLIFrameElement>(null)
    const router = useRouter()
    const data = useRef({
        url: '',
        html: '',
    })

    useEffect(() => {
        docProxy.current = new DocProxy()
    }, [])

    useEffect(() => {
        const loadDoc = (url: string) => {
            if (docProxy.current) {
                docProxy.current.request(url).then((docData) => {
                    console.log('docProxy ', docData)
                    let html = docData.docString
                    html = inject(html, url)
                    data.current.url = url
                    data.current.html = html

                    if (iframe.current) iframe.current.srcdoc = html
                })
            }
        }

        let url = new URL(window.location.href).searchParams.get('url') || ''
        if (url !== data.current.url && url.match(/^https?:\/\//)) loadDoc(url)
    }, [router.query])

    const inject = (html: string, url: string) => {
        return html.replace(
            /(<html[^>]*?>[\s\S]*?<((head)|(meta)|(link))[^>]*?>)/,
            `$1<base href="${url}"><script data-src="${window.location.origin}/content.js" >${contentScript}</script>`
        )
    }

    const reloadAsNoScript = () => {
        console.log('reloadAsNoScript')
        let html = noScript(data.current.html)
        html = inject(html, data.current.url)
        if (iframe.current) iframe.current.srcdoc = html
    }

    useEffect(() => {
        const readingHistory = new ReadingHistory()
        const handleMessage = (e: MessageEvent<MessageData>) => {
            switch (e.data.type) {
                case MessageType.refusedDisplay:
                    reloadAsNoScript()
                    break
                case MessageType.summary:
                    readingHistory
                        .push({
                            ...e.data.summary,
                            href: data.current.url,
                        })
                        .then(() => {
                            readingHistory.get(5)
                        })
                    break
            }
        }
        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        if (iframe.current && iframe.current.contentWindow) {
            iframe.current.contentWindow.postMessage(
                {
                    type: PostMessageType.revertScroll,
                },
                '*'
            )
        }
    })

    return (
        <div
            className={style['view-container']}
            style={{
                position: 'relative',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                }}
            >
                <iframe
                    title="View"
                    ref={iframe}
                    width="100px"
                    height="100px"
                    referrerPolicy="origin-when-cross-origin"
                    sandbox="allow-scripts "
                    style={{
                        borderWidth: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
            </div>
        </div>
    )
}
