import {useState, useEffect, useRef} from "react"
import {Explanation, Translation} from '@wrp/ui'
import {MessageData, MessageType} from '@wrp/core'
import type { WordData } from '@wrp/core'

// @ts-ignore
import style from '../style/common.scss?raw'

export default function App() {
    const explanationRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [explanationVisible, setExplanationVisible] = useState(false)
    const [explanationData, setExplanationData] = useState<Partial<WordData>>({})
    const dataRef = useRef({
        explanationXY: [0, 0],
    })

    const [translateVisible, setTranslateVisible] = useState(false)
    const [translateData, setTranslateData] = useState<any>({})

    useEffect(() => {
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
                    if (explanationRef.current) {
                        explanationRef.current.style.transform = `translate(0px, 0px)`
                    }
                    setExplanationData({
                        word: data.text,
                        state: 'loading',
                        star: false,
                        timestamp: 0,
                    })
                    break
                case MessageType.lookUpPosition:
                    let xy = centre(data.position)
                    if (explanationRef.current)
                        explanationRef.current.style.transform = `translate(${
                            xy[0] - dataRef.current.explanationXY[0]
                        }px,${xy[1] - dataRef.current.explanationXY[1]}px)`
                    break
                case MessageType.tapBlank:
                    setExplanationVisible(false)
                    break
                case MessageType.translate:
                    setTranslateVisible(true)
                    break
            }
        }

        const handleExtensionMessage = (message: MessageData) => {
            const data: MessageData = {...message}
            switch (data.type) {
                case MessageType.lookUpResult:
                    setExplanationData(data.data)
                    break
                case MessageType.translateResult:
                    setTranslateData(data.data)
                    break
            }
        }

        chrome.runtime.onMessage.addListener(handleExtensionMessage)

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }

    }, [])


    return (
        <div
            id={'root'}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
            }}>
            <style>{style}</style>
            <Explanation
                ref={explanationRef}
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
            />
        </div>
    )
}
