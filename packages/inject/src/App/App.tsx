import React, {
    useState,
    useEffect,
    useRef,
} from "react"
import {
    MessageData,
    MessageType,
    WordData,
    detectCSP,
    TriggerMode,
} from '@wrp/core'
import {
    sendMessage,
    sendContentMessage,
    addContentMessageListener,
} from '../content/message'
import {
    Explanation,
    Translation,
    useFontSize,
    AnchorModal,
    CoverLayer,
} from "@wrp/ui"
import { CSSGlobal } from './CSSGlobal'

import { options } from "../content/options"
import { dispatchClickLink, componentsVisibleChange } from "../content"
import { InjectMessage } from "../type"

import { styled } from "@mui/system"

const Base = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999999999999999,
    color: 'black',
    textAlign: 'left',
    fontSize: '16px',
    fontFamily: 'sans-serif',
})

const InvisibleFrame = styled('iframe')`
    position: fixed;
    bottom: 0;
    right: 0;
    height: 0;
    width: 0;
    opacity: 0;
    visibility: none;
    border: none;
    outline: none;
`

type PlayPronunciation = Parameters<Required<Parameters<typeof Explanation>[0]>['overridePlay']>[0]

type Props = {
    invisibleFrameSrc?: string
    alwaysShowAnchor?: boolean
    proxyTriggerLink?: boolean
}

interface TransformDiv extends HTMLDivElement {
    transform?: (x: number, y: number) => void
}

export function App(props: Props) {
    const explanationRef = useRef<TransformDiv>(null)
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [explanationVisible, setExplanationVisible] = useState(false)
    const [explanationStatus, setExplanationStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [wordData, setWordData] = useState<Partial<WordData>>({})
    const [explanationZIndex, setExplanationZIndex] = useState(0)

    const [translateVisible, setTranslateVisible] = useState(false)
    const [translateData, setTranslateData] = useState<any>({})
    const [translatePosition, setTranslatePosition] = useState<DOMRect>()
    const [mediaCSPViolation, setMediaCSPViolation] = useState(false)

    const translateRef = useRef<TransformDiv>(null)
    const dataRef = useRef({
        explanationXY: [0, 0],
        translateXY: [0, 0],
        explanationVisible,
        translateVisible,
    })

    dataRef.current.explanationVisible = explanationVisible
    dataRef.current.translateVisible = translateVisible
    componentsVisibleChange(explanationVisible, translateVisible)

    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [anchorVisible, setAnchorVisible] = useState(false)

    const style = useFontSize()

    const [triggerMode, setTriggerMode] = useState<TriggerMode>(options.triggerMode)
    const [coverVisible, setCoverVisible] = useState(false)

    useEffect(() => {
        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleTapWordMessage = (data: Extract<InjectMessage, { type: 'tapWord' }>) => {
            const { text, position, element } = data.payload
            const translateEl = translateRef.current
            const lookUpMessage: MessageData = {
                type: 'lookUp',
                text,
                position,
            }
            sendMessage(lookUpMessage)
            setExplanationVisible(true)
            setExplanationStatus('loading')
            let dxdy = centre(position)
            setPosition(dxdy)
            dataRef.current.explanationXY = dxdy
            setWordData({
                word: text,
            })
            console.log('handle tap word', translateEl, element, translateEl?.contains(element))
            const index = translateEl?.contains(element) ? 1 : 0
            setExplanationZIndex(index)
        }

        const handleTranslateMessage = (data: Extract<MessageData, { type: 'translate' }>) => {
            sendMessage(data)
            setTranslateVisible(true)
            setTranslatePosition(data.position)
            dataRef.current.translateXY = [data.position.left, data.position.top]
            setTranslateData({
                original: data.text
            })
        }

        const handleTargetPositionMessage = (data: Extract<MessageData, { type: 'targetPosition' }>) => {
            const { word, sentence } = data.payload
            if (word && explanationRef.current) {
                if (Array.isArray(word)) {
                    const [dx, dy] = [...word]
                    explanationRef.current.transform && explanationRef.current.transform(dx, dy)
                } else {
                    const xy = centre(word)
                    const [dx, dy] = [
                        xy[0] - dataRef.current.explanationXY[0],
                        xy[1] - dataRef.current.explanationXY[1]
                    ]
                    explanationRef.current.transform && explanationRef.current.transform(dx, dy)
                }
            }

            if (sentence && translateRef.current) {
                if (Array.isArray(sentence)) {
                    const [dx, dy] = [...sentence]
                    translateRef.current.transform && translateRef.current.transform(dx, dy)
                } else {
                    const xy = [sentence.left, sentence.bottom]
                    const [dx, dy] = [
                        xy[0] - dataRef.current.translateXY[0],
                        xy[1] - dataRef.current.translateXY[1]
                    ]
                    console.log('range rect sentence: ', dx, dy, sentence.top)
                    translateRef.current.transform && translateRef.current.transform(dx, dy)
                }
            }
        }

        const handleContentMessage = (data: InjectMessage) => {
            console.log('content message', data)
            switch (data.type) {
                case 'tapWord':
                    handleTapWordMessage(data)
                    break
                case 'translate':
                    handleTranslateMessage(data)
                    break
                case 'targetPosition':
                    handleTargetPositionMessage(data)
                    break
                case 'tapBlank':
                    // setExplanationVisible(false)
                    // setTranslateVisible(false)
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
                case 'open':
                    setUrl(data.payload.url)
                    setTitle(data.payload.title)
                    setAnchorVisible(true)
                    break
                case 'setTriggerMode':
                    setTriggerMode(data.payload.mode)
                    break
                case 'setCoverVisible':
                    setCoverVisible(data.payload.visible)
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
        const explanationEl = explanationRef.current
        const translateEl = translateRef.current

        const handleClick = (e: MouseEvent) => {
            const target = e.composedPath()[0] as HTMLElement

            const { explanationVisible, translateVisible } = dataRef.current
            const isExplanation = explanationEl?.contains(target)
            const isTranslate = translateEl?.contains(target)

            if (explanationVisible && !isExplanation) {
                setExplanationVisible(false)
            }

            if (translateVisible && !isTranslate && !isExplanation) {
                setTranslateVisible(false)
            }
        }

        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [])

    const overridePlayPronunciation = (data: PlayPronunciation) => {
        sendMessage<MessageData>({
            type: 'playPronunciation',
            data,
        })
    }

    const hanldeGo = (url: string, blank: boolean) => {
        if (props.proxyTriggerLink) {
            return sendMessage<MessageData>({
                type: 'open',
                payload: {
                    url: url,
                    title: title,
                    blank: blank
                }
            })
        }

        dispatchClickLink()
    }

    const handleCoverLayerClose = () => {
        setCoverVisible(false)
        sendMessage<MessageData>({
            type: 'coverVisibleChange',
            payload: {
                visible: false,
            }
        })
    }

    return (
        <Base style={style}>
            <CSSGlobal />

            {coverVisible && <CoverLayer
                onClose={handleCoverLayerClose}
            />}
            <Explanation
                ref={explanationRef}
                visible={explanationVisible}
                position={position}
                zoom={1}
                zIndex={explanationZIndex}
                data={wordData}
                status={explanationStatus}
                onClose={() => setExplanationVisible(false)}
                overridePlay={mediaCSPViolation ? overridePlayPronunciation : undefined}
            />
            <Translation
                ref={translateRef}
                visible={translateVisible}
                onClose={() => setTranslateVisible(false)}
                data={translateData}
                rect={translatePosition}
            />

            {
                (props.alwaysShowAnchor || coverVisible) && <AnchorModal
                    title={title}
                    url={url}
                    visible={anchorVisible}
                    onClose={() => setAnchorVisible(false)}
                    onGo={hanldeGo}
                />
            }

            {
                mediaCSPViolation && <InvisibleFrame src={props.invisibleFrameSrc} />
            }
        </Base>

    )
}
