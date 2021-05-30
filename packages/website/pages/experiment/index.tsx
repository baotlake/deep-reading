import { useRef, useEffect } from 'react'
import Link from 'next/link'

export default function Experiment() {
    const iframeEl = useRef<HTMLIFrameElement>()

    useEffect(() => {

        (iframeEl.current as HTMLIFrameElement).srcdoc = `<html>
            <head></head>
            <body>
                <p>Hello iframe!</p>
            </body>
        </html>`
    }, [])

    return (
        <div>
            <iframe ref={iframeEl} />
            <Link href="/ui" >ui</Link>
        </div>
    )
}
