
type Props = {
    content: string
}

export function ReaderMode({ content }: Props) {
    return (
        <html>
            <head>
                <meta name="deep reading reader mode" content=""></meta>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossOrigin="anonymous" />
                <style>{`
                    #readability-page-1 {
                        margin: 3em 1.2em;
                    }
                `}</style>
            </head>
            <body dangerouslySetInnerHTML={{ __html: content }}></body>
        </html>
    )
}