/// <reference path="../../module.d.ts" />

import {useEffect, useRef, useState} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {useRouter} from 'next/router'
import {DocProxy, DocData, MessageData, MessageType, noScript, PostMessageType, ReadingHistory} from '@wrp/core'
import Loading from './Loading'
import {Blank, Failed} from './Content'
import AnchorModule from "./AnchorModule"
import Backdrop from '@mui/material/Backdrop'
import contentScript from '@wrp/core/dist/injection/website.js?raw'
import style from './view.module.scss'

export default function View() {
    const docProxy = useRef<DocProxy>()
    const iframe = useRef<HTMLIFrameElement>(null)
    const router = useRouter()
    const dataRef = useRef({
        mount: false,
        loadingUrl: '',
        docData: {} as DocData,
        docRenderTime: 0,
        noScript: false,
        lastMessageTime: 0,
        openUrl: '',
    })
    const [loading, setLoading] = useState(false)
    const [anchorVisible, setAnchorVisible] = useState(false)

    useEffect(() => {
        dataRef.current.mount = true
        docProxy.current = new DocProxy()
        const readingHistory = new ReadingHistory()
        const handleMessage = (e: MessageEvent<MessageData>) => {
            const data = e.data
            dataRef.current.lastMessageTime = Date.now()
            switch (data.type) {
                case MessageType.refusedDisplay:
                    renderDoc({noScript: true})
                    break
                case MessageType.summary:
                    dataRef.current.docData.status === 'success' && readingHistory
                        .push({
                            ...data.summary,
                            href: dataRef.current.docData.url,
                        })
                        .then(() => {
                            readingHistory.get(5)
                        })
                    break
                case MessageType.heartbeat:
                    break
                case MessageType.open:
                    dataRef.current.openUrl = data.href
                    setAnchorVisible(true)
                    break
            }
        }
        window.addEventListener('message', handleMessage)

        const heartbeatWatch = () => {
            let now = Date.now()
            // refused to connect
            if (
                now - dataRef.current.docRenderTime < 1000 * 10
                && now - dataRef.current.lastMessageTime > 1000 * 1
                && !dataRef.current.noScript
            ) {
                renderDoc({noScript: true})
            }
            if (dataRef.current.mount) setTimeout(heartbeatWatch, 1000 * 0.8)
        }
        heartbeatWatch()

        return () => {
            dataRef.current.mount = false
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        let url = new URL(window.location.href).searchParams.get('url') || ''
        // console.log('url: ', url, router.route)
        if (url !== dataRef.current.loadingUrl && url.match(/^https?:\/\//)) {
            loadDoc(url)
        }

        if (url === '' && router.route === '/reading') {
            let html = renderToStaticMarkup(<Blank/>)
            html = inject(html, window.location.origin + window.location.pathname)
            if (iframe.current) iframe.current.srcdoc = html
        }

    }, [router.query, router.route])

    useEffect(() => {
        if (iframe.current && iframe.current.contentWindow) {
            iframe.current.contentWindow.postMessage(
                {
                    type: PostMessageType.revertScroll,
                },
                '*'
            )
        }
    }, [router.route])

    const inject = (html: string, url: string) => {
        // 完整html & html code snippet
        return html.replace(
            /(<html[^>]*?>[\s\S]*?<((head)|(meta)|(link)|(script))[^>]*?>)|(<[\w]+?>)/,
            `$1<base href="${url}"><script>${contentScript}</script>`
        );
    }

    const loadDoc = (url: string) => {
        if (docProxy.current) {
            dataRef.current.loadingUrl = url
            setLoading(true)
            docProxy.current.request(url).then((docData) => {
                console.log('docProxy ', docData)
                dataRef.current.docData = docData
                if (docData.status === 'success') {
                    renderDoc()
                }
                if (docData.status === 'failed') {
                    dataRef.current.docData.docString = renderToStaticMarkup(<Failed/>)
                    renderDoc()
                }

                if (dataRef.current.mount) setLoading(false)
            })
        }
    }

    const renderDoc = (options?: {
        noScript?: boolean
    }) => {
        let html = dataRef.current.docData.docString
        dataRef.current.noScript = false
        if (options && options.noScript) {
            html = noScript(html)
            dataRef.current.noScript = true
        }
        html = inject(html, dataRef.current.docData.url)
        if (iframe.current) iframe.current.srcdoc = html
    }

    return (
        <div className={style['view-root']}>
            <div className={style['container']}>
                <iframe
                    title="View"
                    ref={iframe}
                    referrerPolicy="origin-when-cross-origin"
                    sandbox="allow-scripts "
                    // sandbox="allow-scripts allow-forms"
                    style={{
                        borderWidth: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
                {loading && (
                    <Backdrop className={style['backdrop']} open={true}>
                        <Loading href={dataRef.current.loadingUrl}/>
                    </Backdrop>
                )}
            </div>
            <AnchorModule
                visible={anchorVisible}
                onClose={() => setAnchorVisible(false)}
                href={dataRef.current.openUrl}
            />
        </div>
    )
}
