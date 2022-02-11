import { Explanation, Point, Translation, TranslateBox } from '@wrp/ui'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageType, MessageData, Dictionary, Translator } from '@wrp/core'

export default function Reading() {
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [explanationVisible, setExplanationVisible] = useState(false)
    const [explanationStatus, setExplanationStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [wordData, setWordData] = useState({
        word: 'experiment',
    })
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
        const lookUp = new Dictionary()
        const translate = new Translator()

        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleMessage = (e: MessageEvent<MessageData>) => {
            let data = e.data
            switch (data.type) {
                case 'lookUp':
                    setExplanationVisible(true)
                    setExplanationStatus('loading')
                    setWordData({
                        word: data.text
                    })
                    setPosition(centre(data.position))
                    dataRef.current.explanationXY = centre(data.position)
                    if (explanationRef.current)
                        explanationRef.current.style.transform = `translate(0px,0px)`
                    lookUp.search(data.text).then((data) => {
                        if (data && 'word' in data) {
                            setExplanationStatus('success')
                            setWordData(data)
                        } else {
                            setExplanationStatus('failed')
                        }
                    })
                    break
                case 'rangeRect':
                    if (explanationRef.current && data.word) {
                        let xy = centre(data.word)
                        explanationRef.current.style.transform = `translate(${xy[0] - dataRef.current.explanationXY[0]
                            }px,${xy[1] - dataRef.current.explanationXY[1]}px)`
                    }
                    if (translateRef.current && data.sentence) {
                        let xy = [data.sentence.left, data.sentence.top]
                        translateRef.current.style.transform = `translate(${xy[0] - dataRef.current.translateXY[0]
                            }px,${xy[1] - dataRef.current.translateXY[1]}px)`
                    }
                    break
                case 'tapBlank':
                    console.log('explanationVisible: ', explanationVisible)
                    setExplanationVisible(false)
                    if (!dataRef.current.cardMode) setTranslateVisible(false)
                    break
                case 'translate':
                    setTranslateVisible(true)
                    setTranslatePosition(data.position)
                    translate.translate(data.text).then((value) => {
                        setTranslateData(value)
                    })
                    dataRef.current.translateXY = [data.position.left, data.position.top]
                    if (translateRef.current) translateRef.current.style.transform = `translate(0px,0px)`
                    break
                case 'DOMContentLoaded':
                    console.log('DOMContentLoaded')
                    setExplanationVisible(false)
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

            <Translation
                ref={translateRef}
                visible={translateVisible}
                onClose={() => setTranslateVisible(false)}
                data={translateData}
                rect={translatePosition}
            />

            <Explanation
                ref={explanationRef}
                visible={explanationVisible}
                status={explanationStatus}
                position={position}
                zoom={1}
                data={wordData}
                onClose={() => setExplanationVisible(false)}
            />
        </div>
    )
}
