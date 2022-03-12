import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import PageLoading from '../components/PageLoading'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)

        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="application-name" content="Deep Reading" />
                    <meta name="description"
                        content="在手机、平板上随时随地无障碍阅读英文网页，不用担心不认识的单词、不用担心看不懂，借助Deep Reading，开启你的最佳学习之旅。" />
                    <meta name="keywords" content="Deep Reading,英语阅读,学习英语,英文文档,手机阅读,移动端阅读"></meta>
                    <meta httpEquiv="Content-Security-Policy" content="frame-src 'self' blob: data:;" ></meta>
                    {
                        // true
                        //     ? <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;frame-src 'self' blob:;" ></meta>
                        //     : <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;frame-src 'self' blob:;" ></meta>
                    }
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="icon" href="favicon.svg" />
                    <link rel="apple-touch-icon" href="logo_180.png" />
                    <meta name="theme-color" content='#007CA3' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
