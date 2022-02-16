/// <reference path="../../../module.d.ts" />

import { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { NextRouter, useRouter } from 'next/router'
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
import { Blank, Failed } from '../Content'
import Backdrop from '@mui/material/Backdrop'

import contentScript from '@wrp/inject/dist/website.js?raw'
import style from './index.module.scss'

type DocData = Awaited<ReturnType<InstanceType<typeof DocProxy>['request']>>

export default function View() {
    const dataRef = useRef({
        mount: false,
        loadingUrl: '',
        docData: {} as DocData,
        docRenderTime: 0,
        noScript: false,
        lastMessageTime: 0,
        router: null as any as NextRouter,
    })
    const iframe = useRef<HTMLIFrameElement>(null)
    const router = useRouter()

    dataRef.current.router = router

    const docProxy = useRef<DocProxy>()

    const [loading, setLoading] = useState(false)

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

            console.log('Frame View m: ', data)
            switch (data.type) {
                case 'refusedDisplay':
                    renderDoc({ noScript: true })
                    break
                case 'summary':
                    dataRef.current.docData.status === 'success' && readingHistory
                        .push({
                            ...data.summary,
                            href: dataRef.current.docData.url,
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

        console.log('url: ', url, router.route, router.query)

        if (url !== dataRef.current.loadingUrl && url.match(/^https?:\/\//)) {
            loadDoc(url)
        }

        if (url === '' && router.route === '/reading') {
            const html = renderToStaticMarkup(<Blank />)
            const url = window.location.origin + window.location.pathname

            console.log('html', html)
            dataRef.current.docData = {
                ...dataRef.current.docData,
                url,
                docString: html,
            }
            renderDoc()
        }

    }, [router.query, router.route])

    useEffect(() => {
        if (iframe.current && iframe.current.contentWindow) {
            iframe.current.contentWindow.postMessage(
                {
                    type: 'restoreScroll',
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

        console.log('html', html)
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
        </div>
    )
}
