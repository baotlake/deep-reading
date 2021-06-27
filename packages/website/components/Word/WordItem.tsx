import { WordData } from '@wrp/core'

interface Props {
    data: WordData
}

export default function WordItem(props: Props) {
    let data = props.data || {}
    return (
        <div
            style={{
                padding: '10px 20px',
            }}
        >
            <div
                style={{
                    lineHeight: 1.5,
                }}
            >
                <b>{data.word}</b>
                {'\t'}
                <span
                    style={{
                        marginLeft: '20px',
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: '12px',
                    }}
                >
                    {data.pronunciation.symbol_am &&
                        `/${data.pronunciation.symbol_am}/`}
                </span>
            </div>
            <div
                style={{
                    fontSize: '12px',
                    lineHeight: 1.5,
                }}
            >
                {data.answer.map((item, index) => (
                    <dt key={index}>
                        <b>{item[0]}</b>
                        {item[1]}
                    </dt>
                ))}
            </div>
        </div>
    )
}
