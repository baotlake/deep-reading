import { useState, useEffect, useRef } from 'react'
import { Explanation, Point } from '@wrp/ui'
import { MessageType, MessageData, LookUp } from '@wrp/core'
import contentScript from '@wrp/core/dist/content.js?raw'


export default function View() {
    const iframe = useRef<HTMLIFrameElement>(null)

    let [position, setPosition] = useState<[number, number]>()
    let [visible, setVisible] = useState(false)
    let [explanation, setExplanation] = useState({
        word: 'experiment',
    })

    useEffect(() => {
        let url = new URL(window.location.href).searchParams.get('url') || ''

        ;(async () => {
            fetch(
                'https://1773134661611650.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/wrp/wrp_server/get?url=' +
                    encodeURIComponent(url)
            )
                .then(
                    (response) => {
                        return response.json()
                    },
                    () => {
                        return '<html><head></head><body></body></html>'
                    }
                )
                .then((text) => {
                    let html = text.replace(
                        /(<html[^>]*?>[\s\S]*?<head>)/,
                        `$1<base href="${url}" ><script data-src="${window.location.origin}/content.js" >${contentScript}</script>`
                    )

                    if (iframe.current) iframe.current.srcdoc = html
                })
        })()


        const lookUp = new LookUp()

        lookUp.onExplain = (data) => {
            setExplanation(data)
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {

            switch (e.data.type) {
                case MessageType.lookUp:
                    setVisible(true)
                    setPosition([e.data.position.x, e.data.position.y])
                    lookUp.lookUp(e.data.text)
                    break
                case MessageType.lookUpPosition:
                    setPosition([e.data.position.x, e.data.position.y])
                    break
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    return (
        <div
            style={{
                position: 'relative',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '80vh',
                }}
            >
                <iframe
                    title="View"
                    ref={iframe}
                    width="100px"
                    height="100px"
                    style={{
                        border: '1px solid rgba(255, 230, 230, 0.5)',
                        width: '100%',
                        height: '100%',
                    }}
                    srcDoc={`
                    <html>
                        <body>
                            <p style="font-size:30px;">没有内容...</p>
                        </body>
                    </html>
                `}
                    sandbox="allow-scripts "
                    // sandbox=" "
                />
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            >
                <Explanation
                    visible={visible}
                    position={position}
                    zoom={1}
                    explanation={explanation}
                    onClose={() => setVisible(false)}
                />
            </div>
        </div>
    )
}
