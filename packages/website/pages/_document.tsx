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
                        content="青轻阅读,Deep Reading,划词,点读,翻译,英语阅读,学习英语,英文文档,手机阅读,移动端阅读"
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
                    <link rel="icon" href="favicon.png" />
                    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
                    <link rel="apple-touch-icon" sizes="80x80" href="apple-touch-icon-80x80.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon-152x152.png" />
                    <link rel="apple-touch-icon" sizes="167x167" href="apple-touch-icon-167x167.png" />
                    <link rel="apple-touch-startup-image" href="/apple-launch.png"></link>
                    <meta name="theme-color" content="#007CA3" />
                    <meta name="apple-mobile-web-app-title" content="青轻阅读"></meta>
                    <meta name="apple-mobile-web-app-capable" content="yes"></meta>
                    <meta name="apple-touch-fullscreen" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#007CA3"></meta>
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
