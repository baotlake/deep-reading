import React, { useState, useEffect, useRef, useReducer } from 'react'
import { MessageData, TargetType, detectCSP } from '@wrp/core'
import { sendMessage, addContentMessageListener } from '../content/message'
import {
    Explanation,
    Translation,
    useFontSize,
    AnchorModal,
    CoverLayer,
} from '@wrp/ui'
import { CSSGlobal } from './CSSGlobal'

import { options } from '../content/options'
import { dispatchClickLink, componentsVisibleChange } from '../content'
import { InjectMessage } from '../type'

import { initialState, reducer, setState } from './reducer'

import { Base, InvisibleFrame } from './app.style'

type PlayPronunciation = Parameters<
    Required<Parameters<typeof Explanation>[0]>['overridePlay']
>[0]

type Props = {
    invisibleFrameSrc?: string
    alwaysShowAnchor?: boolean
    proxyTriggerLink?: boolean
}

interface TransformDiv extends HTMLDivElement {
    transform?: (x: number, y: number) => void
}

export function App(props: Props) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const explanationRef = useRef<TransformDiv>(null)

    const translateRef = useRef<TransformDiv>(null)
    const dataRef = useRef({
        explanationXY: [0, 0],
        translateXY: [0, 0],
        explanationVisible: state.explanationVisible,
        translateVisible: state.translateVisible,
    })

    const [targetType, setTargetType] = useState<TargetType>(options.targetType)

    dataRef.current.explanationVisible = state.explanationVisible
    dataRef.current.translateVisible = state.translateVisible
    componentsVisibleChange(state.explanationVisible, state.translateVisible)
    options.coverVisible = state.coverVisible

    const style = useFontSize()

    useEffect(() => {
        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleTapWordMessage = (
            data: Extract<InjectMessage, { type: 'tapWord' }>
        ) => {
            const { text, position, element } = data.payload
            const translateEl = translateRef.current
            const lookUpMessage: MessageData = {
                type: 'lookUp',
                text,
                position,
            }
            sendMessage(lookUpMessage)
            let dxdy = centre(position)
            dataRef.current.explanationXY = dxdy
            console.log(
                'handle tap word',
                translateEl,
                element,
                translateEl?.contains(element)
            )
            const index = translateEl?.contains(element) ? 1 : 0
            dispatch(
                setState({
                    explanationVisible: true,
                    explanationStatus: 'loading',
                    position: dxdy,
                    wordData: { word: text },
                    explanationZIndex: index,
                })
            )
        }

        const handleTranslateMessage = (
            data: Extract<MessageData, { type: 'translate' }>
        ) => {
            sendMessage(data)
            dataRef.current.translateXY = [
                data.position.left,
                data.position.top,
            ]
            dispatch(
                setState({
                    translateVisible: true,
                    translateData: { original: data.text },
                    translatePosition: data.position,
                })
            )
        }

        const handleTargetPositionMessage = (
            data: Extract<MessageData, { type: 'targetPosition' }>
        ) => {
            const { word, sentence } = data.payload
            if (word && explanationRef.current) {
                if (Array.isArray(word)) {
                    const [dx, dy] = [...word]
                    explanationRef.current.transform &&
                        explanationRef.current.transform(dx, dy)
                } else {
                    const xy = centre(word)
                    const [dx, dy] = [
                        xy[0] - dataRef.current.explanationXY[0],
                        xy[1] - dataRef.current.explanationXY[1],
                    ]
                    explanationRef.current.transform &&
                        explanationRef.current.transform(dx, dy)
                }
            }

            if (sentence && translateRef.current) {
                if (Array.isArray(sentence)) {
                    const [dx, dy] = [...sentence]
                    translateRef.current.transform &&
                        translateRef.current.transform(dx, dy)
                } else {
                    const xy = [sentence.left, sentence.bottom]
                    const [dx, dy] = [
                        xy[0] - dataRef.current.translateXY[0],
                        xy[1] - dataRef.current.translateXY[1],
                    ]
                    console.log('range rect sentence: ', dx, dy, sentence.top)
                    translateRef.current.transform &&
                        translateRef.current.transform(dx, dy)
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
                    dispatch(
                        setState({
                            explanationStatus: 'success',
                            wordData: { ...data.data },
                        })
                    )
                    break
                case 'translateResult':
                    console.log('translateResult', data)
                    dispatch(setState({ translateData: data.data }))
                    break
                case 'open':
                    dispatch(
                        setState({
                            anchorUrl: data.payload.url,
                            anchorTitle: data.payload.title,
                            anchorVisible: true,
                        })
                    )
                    break
                case 'setTargetType':
                    setTargetType(data.payload.type)
                    break
                case 'setCoverVisible':
                    dispatch(setState({ coverVisible: data.payload.visible }))
                    break
            }
        }

        const removeListener = addContentMessageListener(handleContentMessage)

        detectCSP('media-src').then((directive) => {
            dispatch(setState({ mediaCSPViolation: !!directive }))
        })

        return () => {
            removeListener()
        }
    }, [])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.composedPath()[0] as Element

            const explanationEl = explanationRef.current
            const translateEl = translateRef.current
            const { explanationVisible, translateVisible } = dataRef.current
            const isExplanation = explanationEl?.contains(target)
            const isTranslate = translateEl?.contains(target)

            console.log(
                'inject app handle click',
                isExplanation,
                isTranslate,
                explanationEl,
                translateEl
            )

            if (explanationVisible && !isExplanation) {
                dispatch(setState({ explanationVisible: false }))
            }

            if (translateVisible && !isTranslate && !isExplanation) {
                dispatch(
                    setState({
                        translateVisible: false,
                    })
                )
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
                    title: state.anchorTitle,
                    blank: blank,
                },
            })
        }

        dispatchClickLink()
    }

    const handleCoverLayerClose = () => {
        dispatch(setState({ coverVisible: false }))
        sendMessage<MessageData>({
            type: 'coverVisibleChange',
            payload: {
                visible: false,
            },
        })
    }

    return (
        <Base style={style}>
            <CSSGlobal />

            {state.coverVisible && (
                <CoverLayer onClose={handleCoverLayerClose} />
            )}
            <Explanation
                ref={explanationRef}
                visible={state.explanationVisible}
                position={state.position}
                zoom={1}
                zIndex={state.explanationZIndex}
                data={state.wordData}
                status={state.explanationStatus}
                onClose={() => {
                    // setExplanationVisible(false)
                    dispatch(setState({ explanationVisible: false }))
                }}
                overridePlay={
                    state.mediaCSPViolation
                        ? overridePlayPronunciation
                        : undefined
                }
            />
            <Translation
                ref={translateRef}
                visible={state.translateVisible}
                onClose={() => {
                    dispatch(
                        setState({
                            translateVisible: false,
                        })
                    )
                }}
                data={state.translateData}
                rect={state.translatePosition}
            />

            {(props.alwaysShowAnchor || state.coverVisible) && (
                <AnchorModal
                    title={state.anchorTitle}
                    url={state.anchorUrl}
                    visible={state.anchorVisible}
                    onClose={() => {
                        dispatch(setState({ anchorVisible: false }))
                    }}
                    onGo={hanldeGo}
                />
            )}

            {state.mediaCSPViolation && (
                <InvisibleFrame src={props.invisibleFrameSrc} />
            )}
        </Base>
    )
}
