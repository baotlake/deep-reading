
type Props = {
    url?: string
    code?: string
}

export default function Failed(props: Props) {

    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
            </head>
            <div
                style={{
                    margin: '60px 20px',
                    color: '#334',
                }}
            >
                <h1>
                    无法打开这个网页
                </h1>
                {
                    props.url ? (
                        <p>
                            <span>{props.url}</span>
                            的页面暂时无法打开
                        </p>
                    ) : (
                        <p>
                            网页暂时无法打开
                        </p>
                    )
                }
                <pre>{props.code}</pre>
            </div>
        </html>
    )
}
