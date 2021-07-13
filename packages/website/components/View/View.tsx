/// <reference path="../../module.d.ts" />

import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import {DocProxy, MessageData, MessageType, noScript, PostMessageType, ReadingHistory} from '@wrp/core'
import Loading from './Loading'
import Backdrop from '@material-ui/core/Backdrop'
import contentScript from '@wrp/core/dist/injection.js?raw'
import style from './view.module.scss'

export default function View() {
    const docProxy = useRef<DocProxy>()
    const iframe = useRef<HTMLIFrameElement>(null)
    const router = useRouter()
    const data = useRef({
        mount: false,
        url: '',
        html: '',
        htmlLoadedTime: 0,
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
                case MessageType.heartbeat:
                    break
            }
        }
        window.addEventListener('message', handleMessage)

        const heartbeatWatch = () => {
            let now = Date.now()
            // refused to connect
            if (now - data.current.htmlLoadedTime < 1000 * 10 && now - data.current.lastMessageTime > 1000 * 2) {
                reloadAsNoScript()
            }
            setTimeout(heartbeatWatch, 1000 * 2)
        }

        heartbeatWatch()

        return () => {
            data.current.mount = false
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        const loadDoc = (url: string) => {
            if (docProxy.current) {
                data.current.url = url
                setLoading(true)
                docProxy.current.request(url).then((docData) => {
                    console.log('docProxy ', docData)
                    let html = docData.docString
                    html = inject(html, url)
                    data.current.html = html
                    data.current.htmlLoadedTime = Date.now()

                    if (iframe.current) iframe.current.srcdoc = html
                    if (data.current.mount) setLoading(false)
                })
            }
        }

        let url = new URL(window.location.href).searchParams.get('url') || ''
        if (url !== data.current.url && url.match(/^https?:\/\//)) loadDoc(url)
    }, [router.query])

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
                        <Loading href={data.current.url}/>
                    </Backdrop>
                )}
            </div>
        </div>
    )
}
