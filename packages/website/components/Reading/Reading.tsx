import { Explanation, Point, Translation, AnchorModule } from '@wrp/ui'
import { useState, useEffect, useRef } from 'react'
import { MessageType, MessageData, LookUp, Translate } from '@wrp/core'

export default function Reading() {
    let [position, setPosition] = useState<[number, number]>()
    let [explanationVisible, setExplanationVisible] = useState(false)
    let [explanationData, setExplanationData] = useState({
        word: 'experiment',
    })
    let [anchorVisible, setAnchorVisible] = useState(false)
    let [href, setHref] = useState('')

    let [translateVisible, setTranslateVisible] = useState(false)
    let [translateData, setTranslateData] = useState({})

    useEffect(() => {
        const lookUp = new LookUp()
        const translate = new Translate()

        lookUp.onExplain = (data) => {
            console.log('onExplain ', data)
            setExplanationData(data)
        }

        translate.onTranslate = (data) => {
            setTranslateData(data)
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {
            switch (e.data.type) {
                case MessageType.lookUp:
                    setExplanationVisible(true)
                    setPosition([e.data.position.x, e.data.position.y])
                    lookUp.lookUp(e.data.text)
                    break
                case MessageType.lookUpPosition:
                    setPosition([e.data.position.x, e.data.position.y])
                    break
                case MessageType.open:
                    setAnchorVisible(true)
                    setHref(e.data.href)
                    break
                case MessageType.tapBlank:
                    console.log('explanationVisible: ', explanationVisible)
                    setExplanationVisible(false)
                    break
                case MessageType.translate:
                    setTranslateVisible(true)
                    translate.translate(e.data.text)
                    break
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        >
            <Explanation
                visible={explanationVisible}
                position={position}
                zoom={1}
                data={explanationData}
                onClose={() => setExplanationVisible(false)}
            />

            <Translation
                visible={translateVisible}
                onClose={() => setTranslateVisible(false)}
                data={translateData}
                original={{
                    elements:
                        'Whether planning a lesson or training staff, we have the material to help you. ',
                }}
                translation={{
                    text: '无论是计划课程还是培训员工，我们都有可以帮助您的材料',
                }}
            />

            <AnchorModule
                visible={anchorVisible}
                onClose={() => setAnchorVisible(false)}
                href={href}
            />
        </div>
    )
}
