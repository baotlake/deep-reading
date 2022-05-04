import Script from 'next/script'
import { useEffect } from 'react'
import { matchChatVisiblePath } from '../../utils'

type Props = {
    path?: string
}
export function TidioChat({ path }: Props) {

    useEffect(() => {
        const visible = matchChatVisiblePath(path)
        const tidio = window.tidioChatApi
        const handleTidioReady = () => {
            visible ? window.tidioChatApi?.show() : window.tidioChatApi?.hide()
        }
        if (tidio) {
            visible ? tidio.show() : tidio.hide()
        }
        document.addEventListener('tidioChat-ready', handleTidioReady)

        return () => {
            document.removeEventListener('tidioChat-ready', handleTidioReady)
        }
    }, [path])

    return (
        <>
            <Script
                strategy='lazyOnload'
                src="//code.tidio.co/ikhcbgpkjdruegf4uznk4ohwbtrzjj7e.js"
                async
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        #tidio-chat-iframe { 
                            bottom: 60px !important;
                            margin-bottom: 1em !important; }
                        @media only screen and (max-width: 980px) {
                            #tidio-chat-iframe { bottom: 60px !important;
                            margin-bottom: 0em !important; }
                        }
                    `,
                }}
            />
        </>
    )
}