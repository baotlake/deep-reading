import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


export function TidioChat() {

    const router = useRouter()

    useEffect(() => {
        const visiblePattern = /\/about|\/start/
        const invisiblePattern = /^\/reading|^\/word/
        const visible = !invisiblePattern.test(router.asPath)
        const tidio = window.tidioChatApi
        if (tidio) {
            visible ? tidio.show() : tidio.hide()
        }
    }, [router.asPath])

    return (
        <Head>
            <script
                async
                src="//code.tidio.co/ikhcbgpkjdruegf4uznk4ohwbtrzjj7e.js"
            ></script>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        #tidio-chat-iframe { 
                            bottom: 60px !important;
                            margin-bottom: 10em !important; }
                        @media only screen and (max-width: 980px) {
                            #tidio-chat-iframe { bottom: 60px !important;
                            margin-bottom: 0em !important; }
                        }
                    `,
                }}
            />
        </Head>
    )
}