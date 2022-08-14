import { box } from './style'
import TreeSpaceSvg from '../../../assets/illustration/tree_space.svg?svgr'

export function Blank() {
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <title>未开始阅读</title>
            </head>
            <div
                style={{
                    ...box,
                }}
            >
                <TreeSpaceSvg
                    width={301}
                    height={208}
                    style={{
                        display: 'block',
                        margin: 'auto',
                    }}
                />
                <div
                    style={{
                        textAlign: 'center',
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: '1em',
                        margin: '1em auto',
                    }}
                >尚未开始阅读</div>
                <h2></h2>
                <p>
                    点击底部的“发现”和“开始”按钮，打开有兴趣或阅读过的页面
                </p>

                <section
                    style={{
                        color: '#667',
                    }}
                >
                    <h2>了解如何使用</h2>
                    <p>
                        <b>查单词</b>：直接点击单词即可，你可以点击后面英文句子中的单词试试哦～</p>
                    <p>If you wish to succeed, you should use persistence as your good friend, experience as your reference, prudence as your brother and hope as your sentry.</p>
                    <p>
                        <b>翻译句子</b>：在句子上横向轻扫或用鼠标长按
                    </p>
                </section>

            </div>
        </html>
    )
}
