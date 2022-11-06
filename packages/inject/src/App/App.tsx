import React, { useRef, useReducer } from 'react'
import { MessageData, Marker } from '@wrp/core'
import { sendMessage } from '../content/message'
import {
    Explanation,
    Translation,
    AnchorModal,
    CoverLayer,
    useFontSize,
    useObserver,
} from '@wrp/ui'
import { CSSGlobal } from './CSSGlobal'
import { options } from '../content/options'
import { initialState, reducer, setState } from './reducer'
import { Base, InvisibleFrame } from './app.style'
import { useSetup, SetupRefData } from './useSetup'
import { useMessage, MessageRefData } from './useMessage'
import { useClickAway, ClickAwayRefData } from './useClickAway'

import { TransformDiv, MarkPreffix } from '../type'

type PlayPronunciation = Parameters<
    Required<Parameters<typeof Explanation>[0]>['overridePlay']
>[0]

type Props = {
    invisibleFrameSrc?: string
    alwaysShowAnchor?: boolean
    proxyTriggerLink?: boolean
}

const markPreffix: MarkPreffix = 'dr-highlight-'

export function App(props: Props) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const explanationRef = useRef<TransformDiv>(null)
    const translateRef = useRef<TransformDiv>(null)

    const observer = useObserver()

    const dataRef = useRef<MessageRefData & SetupRefData & ClickAwayRefData>({
        wordMarker: new Marker(markPreffix),
        setenceMarker: new Marker(markPreffix),
        explanationXY: [0, 0],
        translateXY: [0, 0],
        explanationOutbound: false,
        translateOutbound: false,
        explanationRef,
        translateRef,
        observer,
        dispatch,
    })

    const explanationVisible = state.explanationVisible
    const translateVisible = state.translateVisible

    options.coverVisible = state.coverVisible

    const style = useFontSize()

    useMessage(dataRef, dispatch)
    useSetup(dataRef, dispatch)
    useClickAway(dataRef, explanationVisible, translateVisible)

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

        if (state.anchorElement) {
            state.anchorElement.click()
        }
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
                outbound={state.explanationOutbound}
                position={state.position}
                zIndex={state.explanationZIndex}
                data={state.wordData}
                status={state.explanationStatus}
                onClose={() => {
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
                outbound={state.translateOutbound}
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
