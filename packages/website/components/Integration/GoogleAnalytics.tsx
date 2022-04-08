import Head from 'next/head'

const __DEV__ = process.env.NODE_ENV == "development"

export function GoogleAnalytics() {

    return (
        <Head>
            {__DEV__ ? (
                <meta
                    name="Google Analytics"
                    content="Google Analytics only available on Production"
                />
            ) : (
                <>
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-F4DT269F2G"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());

                                gtag('config', 'G-F4DT269F2G');`,
                        }}
                    />
                </>
            )}
        </Head>
    )
}