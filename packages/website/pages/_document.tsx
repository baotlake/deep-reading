import Document, {
    DocumentContext,
    Html,
    Head,
    Main,
    NextScript,
} from "next/document"

const viewSrc = process.env.VIEW_SRC
const viewHost = viewSrc ? new URL(viewSrc).host : '*'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="zh">
                <Head>
                    <meta name="application-name" content="青轻阅读 Deep Reading" />
                    <meta
                        name="description"
                        content="青轻阅读 Deep Reading - 轻松阅读英语，秒查词，秒翻译"
                    />
                    <meta
                        name="keywords"
                        content="青轻阅读,Deep Reading,英语阅读,学习英语,英文文档,查词,翻译,划词,点读,手机阅读,移动端阅读,英语,阅读"
                    />
                    <meta
                        httpEquiv="Content-Security-Policy"
                        content={`frame-src 'self' ${viewHost};`}
                    />
                    {
                        // true
                        //     ? <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;frame-src 'self' blob:;" ></meta>
                        //     : <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;frame-src 'self' blob:;" ></meta>
                    }
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="icon" href="/favicon.png" />
                    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="apple-touch-icon" sizes="80x80" href="/apple-touch-icon-80x80.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
                    <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png" />

                    {/* iPhone 13 1170*2532 */}
                    <link
                        rel="apple-touch-startup-image"
                        media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
                        href="/apple/1170_2532.png"
                    />
                    {/* iPad Pro 11” */}
                    <link
                        rel="apple-touch-startup-image"
                        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
                        href="/apple/1668_2388.png"
                    />
                    {/* iPad Air 10.5" */}
                    <link
                        rel="apple-touch-startup-image"
                        media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2)"
                        href="/apple/1640_2360.png"
                    />

                    <meta name="theme-color" content="#007CA3" />
                    <meta name="apple-mobile-web-app-title" content="青轻阅读" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-touch-fullscreen" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#007CA3" />

                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="青轻阅读 Deep Reading" />
                    <meta property="og:description" content="青轻阅读 Deep Reading - 轻松阅读英语，秒查词，秒翻译" />
                    <meta property="og:site_name" content="青轻阅读 Deep Reading" />
                    <meta property="og:url" content="https://wrp.netlify.app/start" />
                    <meta property="og:image" content="/apple-touch-icon.png" />

                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
