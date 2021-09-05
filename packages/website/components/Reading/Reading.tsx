import {Explanation, Point, Translation, AnchorModule, TranlsateBox, useTranslateMode} from '@wrp/ui'
import {useState, useEffect, useRef} from 'react'
import {MessageType, MessageData, LookUp, Translator} from '@wrp/core'

export default function Reading() {
    const [translateCardMode, setTranslateCardMode] = useState(true)
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [explanationVisible, setExplanationVisible] = useState(false)
    const [explanationData, setExplanationData] = useState({
        word: 'experiment',
    })
    const [anchorVisible, setAnchorVisible] = useState(false)
    const [href, setHref] = useState('')

    const [translateVisible, setTranslateVisible] = useState(false)
    const [translateData, setTranslateData] = useState({})
    const [translatePosition, setTranslatePosition] = useState<DOMRect>()
    const dataRef = useRef({
        explanationXY: [0, 0],
        translateXY: [0, 0],
        cardMode: true,
    })
    const explanationRef = useRef<HTMLDivElement>(null)
    const translateRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const lookUp = new LookUp()
        const translate = new Translator()

        lookUp.onExplain = (data) => {
            console.log('onExplain ', data)
            setExplanationData(data)
        }

        translate.onTranslate = (data) => {
            setTranslateData(data)
        }

        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {
            let data = e.data
            switch (data.type) {
                case MessageType.lookUp:
                    setExplanationVisible(true)
                    setPosition(centre(data.position))
                    dataRef.current.explanationXY = centre(data.position)
                    if (explanationRef.current)
                        explanationRef.current.style.transform = `translate(0px,0px)`
                    lookUp.lookUp(data.text)
                    break
                case MessageType.rangeRect:
                    if (explanationRef.current && data.word) {
                        let xy = centre(data.word)
                        explanationRef.current.style.transform = `translate(${
                            xy[0] - dataRef.current.explanationXY[0]
                        }px,${xy[1] - dataRef.current.explanationXY[1]}px)`
                    }
                    if (translateRef.current && data.sentence) {
                        let xy = [data.sentence.left, data.sentence.top]
                        translateRef.current.style.transform = `translate(${
                            xy[0] - dataRef.current.translateXY[0]
                        }px,${xy[1] - dataRef.current.translateXY[1]}px)`
                    }
                    break
                case MessageType.open:
                    setAnchorVisible(true)
                    setHref(data.href)
                    break
                case MessageType.tapBlank:
                    console.log('explanationVisible: ', explanationVisible)
                    setExplanationVisible(false)
                    if (!dataRef.current.cardMode) setTranslateVisible(false)
                    break
                case MessageType.translate:
                    setTranslateVisible(true)
                    setTranslatePosition(data.position)
                    translate.translate(data.text)
                    dataRef.current.translateXY = [data.position.left, data.position.top]
                    if (translateRef.current) translateRef.current.style.transform = `translate(0px,0px)`
                    break
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useTranslateMode((cardMode)=> {
        setTranslateCardMode(cardMode)
        dataRef.current.cardMode = cardMode
    })

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        >
            {
                translateCardMode ? (
                    <Translation
                        visible={translateVisible}
                        onClose={() => setTranslateVisible(false)}
                        data={translateData}
                    />
                ) : (
                    <TranlsateBox
                        ref={translateRef}
                        visible={translateVisible}
                        data={translateData}
                        positionRect={translatePosition}
                        onClose={() => setTranslateVisible(false)}
                    />
                )
            }

            <Explanation
                ref={explanationRef}
                visible={explanationVisible}
                position={position}
                zoom={1}
                data={explanationData}
                onClose={() => setExplanationVisible(false)}
            />
            <AnchorModule
                visible={anchorVisible}
                onClose={() => setAnchorVisible(false)}
                href={href}
            />
        </div>
    )
}
