import Script from 'next/script'

export function TidioChat() {

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