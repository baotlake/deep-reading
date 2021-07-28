import Head from 'next/head'

export default function Analytics() {

    if (process.env.NODE_ENV === 'development') {
        return (
            <Head>
                <meta name={"Google Analytics"} content={"Google Analytics only available on Production"}></meta>
            </Head>
        )
    }
    return (
        <Head>
            {/* <!-- Global site tag (gtag.js) - Google Analytics -->*/}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-F4DT269F2G"/>
            <script dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-F4DT269F2G');`
            }}/>
        </Head>
    )
}
