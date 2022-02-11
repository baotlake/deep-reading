import React, {
    useState,
    useEffect,
    useRef,
    memo,
    useCallback,
    ReactPropTypes
} from "react"
import {
    MessageData,
    MessageType,
    WordData,
    // addContentMessageListener,
    // addMessageListener,
    // sendContentMessage,
    detectCSP,
} from '@wrp/core'
import {
    sendMessage,
    sendContentMessage,
    addContentMessageListener,
} from '../content/message'
// import { addContentMessageListener, addMessageListener, sendMessage } from '../content/message'
// import Explanation from '../components/Explanation'
// import Translation from '../components/Translation'
// import TranslateBox from '../components/Translation/Box'
// import useTranslateMode from "../hooks/useTranslateMode"
import { Explanation, Translation, useZoom } from "@wrp/ui"
import styled from '@emotion/styled'
// import { sendContentMessage } from "../content"
// import { detectCSP } from '../core/detect'


const Base = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999999999999999;
    color: black;
    text-align: left;
    font-size: 16px;
`

const InvisibleFrame = styled.iframe`
    position: fixed;
    bottom: 0;
    right: 0;
    height: 0;
    width: 0;
    opacity: 0;
    border: none;
    outline: none;
`

type PlayPronunciation = Parameters<Required<Parameters<typeof Explanation>[0]>['overridePlay']>[0]

type Props = {
    invisibleFrameSrc?: string
}

export function App(props: Props) {
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

    const [translateVisible, setTranslateVisible] = useState(false)
    const [translateData, setTranslateData] = useState<any>({})
    const [translatePosition, setTranslatePosition] = useState<DOMRect>()
    const [mediaCSPViolation, setMediaCSPViolation] = useState(false)

    const style = useZoom()

    useEffect(() => {
        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleContentMessage = (data: MessageData) => {
            console.log('content message', data)
            switch (data.type) {
                case 'lookUp':
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
                case 'translate':
                    sendMessage(data)
                    setTranslateVisible(true)
                    setTranslatePosition(data.position)
                    dataRef.current.translateXY = [data.position.left, data.position.top]
                    if (translateRef.current) translateRef.current.style.transform = `translate(0px,0px)`
                    setTranslateData({
                        original: data.text
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
                    setExplanationVisible(false)
                    setTranslateVisible(false)
                    // if (!dataRef.current.cardMode) 
                    break
                case 'lookUpResult':
                    console.log('lookUpResult', data)
                    setWordData({ ...data.data })
                    setExplanationStatus('success')
                    break
                case 'translateResult':
                    console.log('translateResult', data)
                    setTranslateData(data.data)
                    break
            }
        }

        const removeListener = addContentMessageListener(handleContentMessage)

        detectCSP('media-src').then((directive) => {
            setMediaCSPViolation(!!directive)
        })

        return () => {
            removeListener()
        }
    }, [])

    useEffect(() => {
        sendContentMessage<MessageData>({
            type: 'componentsVisibleChange',
            payload: {
                explanation: explanationVisible,
                translation: translateVisible,
            }
        })
    }, [explanationVisible, translateVisible])

    const overridePlayPronunciation = useCallback((data: PlayPronunciation) => {
        sendMessage<MessageData>({
            type: 'playPronunciation',
            data,
        })
    }, [])

    return (
        <Base style={style}>
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
                position={position}
                zoom={1}
                data={wordData}
                status={explanationStatus}
                onClose={() => setExplanationVisible(false)}
                overridePlay={mediaCSPViolation ? overridePlayPronunciation : undefined}
            />
            {
                mediaCSPViolation && <InvisibleFrame src={props.invisibleFrameSrc} />
            }
        </Base>

    )
}
