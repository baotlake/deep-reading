import Script from 'next/script'

const __DEV__ = process.env.NODE_ENV == "development"

export function GoogleAnalytics() {

    return (
        <>
            {__DEV__ ? (
                <meta
                    name="Google Analytics"
                    content="Google Analytics only available on Production"
                />
            ) : (
                <>
                    <Script
                        strategy='afterInteractive'
                        src="https://www.googletagmanager.com/gtag/js?id=G-F4DT269F2G"
                        async
                    />
                    <Script
                        strategy='beforeInteractive'
                        dangerouslySetInnerHTML={{
                            __html: `window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());

                                gtag('config', 'G-F4DT269F2G');`,
                        }}
                    />
                </>
            )}
        </>
    )
}