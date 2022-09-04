import { useState, MouseEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Switch from '@mui/material/Switch'

import { Explanation, Point, Translation, TranslateBox, AnchorModal } from '@wrp/ui'


export default function UI() {
    let [position, setPosition] = useState<[number, number]>([90, 90])
    let [visible, setVisible] = useState(false)

    const router = useRouter()

    const handleClick = (e: MouseEvent) => {
        setPosition([e.clientX, e.clientY])
        setVisible(true)
    }

    return (
        <div>
            <div
                onClick={handleClick}
                style={{
                    width: '100%',
                    height: '100vh',
                }}
            >
                <h1>experiment/ui</h1>
                <Link href={"#explanation"}>#explanation</Link>
                <Link href={"#translation"}>#translation</Link>
                <Link href={"#translatebox"}>#translatebox</Link>
                <Link href={"#anchor"}>#anchor</Link>

                <Switch value={visible} onChange={() => setVisible(!visible)} />
            </div>

            <Explanation
                visible={visible && location.hash === '#explanation'}
                position={position}
                status={'success'}
                // status={'loading'}
                zoom={1}
                data={{
                    word: 'assistant',
                    pronunciation: {
                        audio_am: "https://res.iciba.com/resource/amp3/1/0/f5/49/f549cd73f694aa6f5541b4ae30894eea.mp3",
                        audio_en: "https://res.iciba.com/resource/amp3/oxford/0/77/51/7751921c39abe3706be91900e30d858e.mp3",
                        audio_other: "https://res-tts.iciba.com/f/5/4/f549cd73f694aa6f5541b4ae30894eea.mp3",
                        symbol_am: "əˈsɪstənt",
                        symbol_en: "əˈsɪstənt",
                        symbol_other: "",
                    },
                    answer: [
                        ['n.', '助手，助理 [化学]（染色的）助剂 辅助物 店员，伙计'],
                        ['adj.', '助理的 辅助的 有帮助的 副的']
                    ]
                }}
                onClose={() => setVisible(false)}
            />

            <Point position={position} size={6} />

            <Translation
                visible={visible && location.hash === '#translation'}
                data={{
                    original: 'Learn how to think in React with step-by-step explanations and interactive examples.',
                    translated: '通过分步解释和交互式示例，了解如何在React中进行思考。',
                }}
                onClose={() => {
                    console.log('set tr visible false')
                    setVisible(false)
                }}
                // pin="card"
                // pin="box"
            />

            <TranslateBox
                visible={visible && location.hash === '#translatebox'}
                // visible={false}
                positionRect={{
                    left: 20,
                    bottom: 300,
                    width: 200,
                }}
                data={{
                    original: 'Learn how to think in React with step-by-step explanations and interactive examples.',
                    translated: '通过分步解释和交互式示例，了解如何在React中进行思考。',
                }}
                onClose={() => {
                    console.log('set tr visible false')
                    setVisible(false)
                }}
            />

            <AnchorModal
                visible={visible && location.hash === '#anchor'}
                title="No Script Tags In Head Component"
                url='https://nextjs.org/docs/basic-features/script'
            />
        </div>
    )
}
