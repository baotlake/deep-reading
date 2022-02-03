import React, { useState, useEffect, useRef, memo, useCallback, ReactPropTypes } from "react"
import { MessageData, MessageType, WordData } from '@wrp/core'
import { addContentMessageListener, addMessageListener, sendMessage } from '@wrp/core'
// import Explanation from '../components/Explanation'
// import Translation from '../components/Translation'
// import TranslateBox from '../components/Translation/Box'
// import useTranslateMode from "../hooks/useTranslateMode"
import { Explanation, TranslateBox, Translation, useTranslateMode } from "@wrp/ui"

import styled from '@emotion/styled'


const Base = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999999999999999;
    color: black;
    text-align: left;
    font-size: 16px;
`

type PlayPronunciation = Parameters<Required<Parameters<typeof Explanation>[0]>['overridePlay']>[0]

export function App() {
    const explanationRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [explanationVisible, setExplanationVisible] = useState(false)
    const [explanationStatus, setExplanationStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [wordData, setWordData] = useState<Partial<WordData>>({})
    const dataRef = useRef({
        explanationXY: [0, 0],
        translateXY: [0, 0],
        cardMode: true,
    })
    const translateRef = useRef<HTMLDivElement>(null)
    const [translateCardMode, setTranslateCardMode] = useState(true)

    const [translateVisible, setTranslateVisible] = useState(false)
    const [translateData, setTranslateData] = useState<any>({})
    const [translatePosition, setTranslatePosition] = useState<DOMRect>()

    useEffect(() => {
        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleContentMessage = (data: MessageData) => {
            console.log('content message', data)
            switch (data.type) {
                case MessageType.lookUp:
                    sendMessage(data)
                    setExplanationVisible(true)
                    setExplanationStatus('loading')
                    setPosition(centre(data.position))
                    dataRef.current.explanationXY = centre(data.position)
                    if (explanationRef.current) {
                        explanationRef.current.style.transform = `translate(0px, 0px)`
                    }
                    setWordData({
                        word: data.text,
                    })
                    break
                case MessageType.translate:
                    sendMessage(data)
                    setTranslateVisible(true)
                    setTranslatePosition(data.position)
                    dataRef.current.translateXY = [data.position.left, data.position.top]
                    if (translateRef.current) translateRef.current.style.transform = `translate(0px,0px)`
                    setTranslateData({
                        original: data.text
                    })
                    break
                case MessageType.rangeRect:
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
                case MessageType.tapBlank:
                    setExplanationVisible(false)
                    if (!dataRef.current.cardMode) setTranslateVisible(false)
                    break
                case MessageType.lookUpResult:
                    console.log('lookUpResult', data)
                    setWordData({ ...data.data })
                    setExplanationStatus('success')
                    break
                case MessageType.translateResult:
                    console.log('translateResult', data)
                    setTranslateData(data.data)
                    break
            }
        }

        const removeListener = addContentMessageListener(handleContentMessage)

        return () => {
            removeListener()
        }
    }, [])

    const overridePlayPronunciation = useCallback((data: PlayPronunciation) => {
        sendMessage<MessageData>({
            type: MessageType.playPronunciation,
            data,
        })
    }, [])

    useTranslateMode((cardMode: boolean) => {
        setTranslateCardMode(cardMode)
        dataRef.current.cardMode = cardMode
    })

    return (
        <Base>
            {
                translateCardMode ? (
                    <Translation
                        visible={translateVisible}
                        onClose={() => setTranslateVisible(false)}
                        data={translateData}
                    />
                ) : (
                    <TranslateBox
                        ref={translateRef}
                        visible={translateVisible}
                        positionRect={translatePosition}
                        onClose={() => setTranslateVisible(false)}
                        data={translateData}
                    />
                )
            }
            <Explanation
                ref={explanationRef}
                visible={explanationVisible}
                position={position}
                zoom={1}
                data={wordData}
                status={explanationStatus}
                onClose={() => setExplanationVisible(false)}
            // overridePlay={overridePlayPronunciation}
            />

        </Base>

    )
}