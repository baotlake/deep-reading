/// <reference path="../../module.d.ts" />

import { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useRouter } from 'next/router'
import {
    DocProxy,
    MessageData,
    MessageType,
    noScript,
    ReadingHistory,
    Dictionary,
    Translator
} from '@wrp/core'
import Loading from './Loading'
import { Blank, Failed } from './Content'
import AnchorModal from "./AnchorModal"
import Backdrop from '@mui/material/Backdrop'

import contentScript from '@wrp/core/es/injection/website.js?raw'
import style from './view.module.scss'

type DocData = Awaited<ReturnType<InstanceType<typeof DocProxy>['request']>>

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
            switch (data.type) {
                case MessageType.refusedDisplay:
                    renderDoc({ noScript: true })
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
                case MessageType.open:
                    dataRef.current.openUrl = data.href
                    setAnchorVisible(true)
                    break
                case MessageType.lookUp:
                    lookUp.search(data.text).then((value) => {
                        sendMessage(source, {
                            type: MessageType.lookUpResult,
                            data: value,
                        })
                    })
                    break
                case MessageType.translate:
                    translate.translate(data.text).then((value) => {
                        sendMessage(source, {
                            type: MessageType.translateResult,
                            data: value,
                        })
                    })
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
        let url = new URL(window.location.href).searchParams.get('url') || ''
        console.log('url: ', url, router.route, router.query)
        if (url !== dataRef.current.loadingUrl && url.match(/^https?:\/\//)) {
            loadDoc(url)
        }

        if (url === '' && router.route === '/reading') {
            let html = renderToStaticMarkup(<Blank />)
            html = inject(html, window.location.origin + window.location.pathname)
            if (iframe.current) iframe.current.srcdoc = html
        }

    }, [router.query, router.route])

    useEffect(() => {
        if (iframe.current && iframe.current.contentWindow) {
            iframe.current.contentWindow.postMessage(
                {
                    type: MessageType.restoreScroll
                },
                '*'
            )
        }
    }, [router.route])

    const inject = (html: string, url: string) => {
        // 完整html & html code snippet
        let point = html.search(/(?<=<html[^>]*?>[\s\S]*?<((head)|(meta)|(link)|(script))[^>]*?>)/)
        if (point === -1) point = html.search(/(?<=<[\w]+?>)/)
        if (point === -1) return `<html><head><base href="${url}"><script type="module">${contentScript}</script></head>` + html + '</html>'
        return html.slice(0, point) + `<base href="${url}"><script type="module">${contentScript}</script>` + html.slice(point)
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
                    dataRef.current.docData.docString = renderToStaticMarkup(<Failed />)
                    renderDoc()
                }

                if (dataRef.current.mount) setLoading(false)
            })
        }
    }

    const renderDoc = (options?: { noScript?: boolean }) => {
        let html = dataRef.current.docData.docString
        dataRef.current.noScript = false
        if (options && options.noScript) {
            html = noScript(html)
            dataRef.current.noScript = true
        }
        html = inject(html, dataRef.current.docData.url)
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        if (iframe.current) iframe.current.src = url
    }

    return (
        <div className={style['view-root']}>
            <div className={style['container']}>
                <iframe
                    title="View"
                    ref={iframe}
                    referrerPolicy="no-referrer"
                    // sandbox="allow-scripts allow-forms allow-same-origin"
                    sandbox="allow-scripts allow-forms"
                    style={{
                        borderWidth: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
                {loading && (
                    <Backdrop className={style['backdrop']} open={true}>
                        <Loading href={dataRef.current.loadingUrl} />
                    </Backdrop>
                )}
            </div>
            <AnchorModal
                visible={anchorVisible}
                onClose={() => setAnchorVisible(false)}
                href={dataRef.current.openUrl}
            />
        </div>
    )
}
