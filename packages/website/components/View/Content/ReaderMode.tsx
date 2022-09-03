
type Props = {
    title: string
    content: string
}

export function ReaderMode({ title, content }: Props) {
    return (
        <html>
            <head>
                <meta name="deep reading reader mode" content=""></meta>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossOrigin="anonymous" />
                <style>{`
                    main {
                        margin: 3em 1.2em;
                        font-size: 18px;
                    }
                    img {
                        max-width: 100%;
                    }
                `}</style>
            </head>
            <body >
                <main >
                    <h1>{title}</h1>
                    <article dangerouslySetInnerHTML={{ __html: content }}>

                    </article>
                </main>
            </body>
        </html>
    )
}