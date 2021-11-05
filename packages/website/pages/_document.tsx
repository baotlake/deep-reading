import Document, {DocumentContext, Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name={"application-name"} content={"Deep Reading"}/>
                    <meta name={"description"}
                          content="在手机、平板上随时随地无负担的阅读英文网页，不用担心不认识的单词、不用担心看不懂，借助Deep Reading，开启你的最佳学习之旅。"/>
                    <meta name={"keywords"} content={"Deep Reading,英语阅读,学习英语,英文文档,手机阅读,移动端阅读"}></meta>
                    <link rel={"manifest"} href={"/manifest.json"} />
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument
