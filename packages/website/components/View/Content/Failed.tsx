import { box } from './style'

type Props = {
    url?: string
    code?: string
}

export function Failed(props: Props) {

    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
            </head>
            <div
                style={box}
            >
                <h1>
                    无法打开这个网页
                </h1>

                <section>
                    <p
                        style={{
                            wordBreak: 'break-word',
                        }}
                    >{props.url}</p>
                    <p>
                        网页暂时无法打开
                    </p>
                </section>
                <pre>{props.code}</pre>
            </div>
        </html>
    )
}
