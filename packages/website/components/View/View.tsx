/// <reference path="../../module.d.ts" />

import {useEffect, useRef, useState} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {useRouter} from 'next/router'
import {DocProxy, DocData, MessageData, MessageType, noScript, PostMessageType, ReadingHistory} from '@wrp/core'
import Loading from './Loading'
import {Blank, Failed} from './Content'
import Backdrop from '@material-ui/core/Backdrop'
import contentScript from '@wrp/core/dist/injection/website.js?raw'
import style from './view.module.scss'

export default function View() {
    const docProxy = useRef<DocProxy>()
    const iframe = useRef<HTMLIFrameElement>(null)
    const router = useRouter()
    const data = useRef({
        mount: false,
        loadingUrl: '',
        docData: {} as DocData,
        docRenderTime: 0,
        noScript: false,
        lastMessageTime: 0,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        data.current.mount = true
        docProxy.current = new DocProxy()
        const readingHistory = new ReadingHistory()
        const handleMessage = (e: MessageEvent<MessageData>) => {
            data.current.lastMessageTime = Date.now()
            switch (e.data.type) {
                case MessageType.refusedDisplay:
                    renderDoc({noScript: true})
                    break
                case MessageType.summary:
                    data.current.docData.status === 'success' && readingHistory
                        .push({
                            ...e.data.summary,
                            href: data.current.docData.url,
                        })
                        .then(() => {
                            readingHistory.get(5)
                        })
                    break
                case MessageType.heartbeat:
                    break
            }
        }
        window.addEventListener('message', handleMessage)

        const heartbeatWatch = () => {
            let now = Date.now()
            // refused to connect
            if (
                now - data.current.docRenderTime < 1000 * 10
                && now - data.current.lastMessageTime > 1000 * 1
                && !data.current.noScript
            ) {
                renderDoc({noScript: true})
            }
            if (data.current.mount) setTimeout(heartbeatWatch, 1000 * 0.8)
        }
        heartbeatWatch()

        return () => {
            data.current.mount = false
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        let url = new URL(window.location.href).searchParams.get('url') || ''
        // console.log('url: ', url, router.route)
        if (url !== data.current.loadingUrl && url.match(/^https?:\/\//)) {
            loadDoc(url)
        }

        if (url === '' && router.route === '/reading') {
            let html = renderToStaticMarkup(<Blank/>)
            html = inject(html, location.href)
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
            `$1<base href="${url}"><script data-src="${window.location.origin}/content.js" >${contentScript}</script>`
        )
    }

    const loadDoc = (url: string) => {
        if (docProxy.current) {
            data.current.loadingUrl = url
            setLoading(true)
            docProxy.current.request(url).then((docData) => {
                console.log('docProxy ', docData)
                data.current.docData = docData
                if (docData.status === 'success') {
                    renderDoc()
                }
                if (docData.status === 'failed') {
                    data.current.docData.docString = renderToStaticMarkup(<Failed/>)
                    renderDoc()
                }

                if (data.current.mount) setLoading(false)
            })
        }
    }

    const renderDoc = (options?: {
        noScript?: boolean
    }) => {
        let html = data.current.docData.docString
        data.current.noScript = false
        if (options && options.noScript) {
            html = noScript(html)
            data.current.noScript = true
        }
        html = inject(html, data.current.docData.url)
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
                    style={{
                        borderWidth: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
                {loading && (
                    <Backdrop className={style['backdrop']} open={true}>
                        <Loading href={data.current.loadingUrl}/>
                    </Backdrop>
                )}
            </div>
        </div>
    )
}
