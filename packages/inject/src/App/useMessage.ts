import { Dispatch, RefObject, useEffect } from 'react'
import { sendMessage, addContentMessageListener } from '../content/message'
import { InjectMessage, TransformDiv } from '../type'
import { getCoparentElement, client2pageRect, Marker } from '@wrp/core'
import { Action, setState } from './reducer'
import { useObserver } from '@wrp/ui'

export type MessageRefData = {
    wordMarker: Marker
    setenceMarker: Marker
    explanationXY: [number, number]
    translateXY: [number, number]
    // explanationRef: RefObject<TransformDiv>
    translateRef: RefObject<TransformDiv>
    observer: ReturnType<typeof useObserver>
}

export function useMessage(
    ref: RefObject<MessageRefData>,
    dispatch: Dispatch<Action>
) {
    useEffect(() => {
        const refData = ref.current
        if (!refData) return

        const { wordMarker, setenceMarker, translateRef, observer } = refData
        const centre = (position: DOMRect): [number, number] => {
            let x = position.x + position.width / 2
            let y = position.y + position.height / 2
            return [x, y]
        }

        const handleLookupRangeMessage = (range: Range) => {
            const text = range.toString()
            const rect = client2pageRect(range.getBoundingClientRect())
            const coparent = getCoparentElement(
                range.startContainer,
                range.endContainer,
                ['MARK']
            )
            if (!coparent) return
            const coparentRect = client2pageRect(
                coparent.getBoundingClientRect()
            )
            // const translateEl = translateRef.current
            sendMessage<InjectMessage>({
                type: 'lookUp',
                text,
                position: rect,
            })
            let dxdy = centre(rect)
            refData.explanationXY = [coparentRect.x, coparentRect.y]
            const index = translateRef.current?.contains(coparent) ? 1 : 0
            dispatch(
                setState({
                    explanationVisible: true,
                    explanationStatus: 'loading',
                    position: dxdy,
                    wordData: { word: text },
                    explanationZIndex: index,
                })
            )
            wordMarker.highlight(range)
            observer.observe('explanation', coparent)
        }

        const handleTranslateRangeMessage = (range: Range) => {
            const text = range.toString()
            const rect = client2pageRect(range.getBoundingClientRect())
            const coparent = getCoparentElement(
                range.startContainer,
                range.endContainer,
                ['MARK']
            )
            if (!coparent) return
            const coparentRect = client2pageRect(
                coparent.getBoundingClientRect()
            )
            sendMessage<InjectMessage>({
                type: 'translate',
                text,
                position: rect,
            })
            refData.translateXY = [coparentRect.left, coparentRect.top]
            dispatch(
                setState({
                    translateVisible: true,
                    translateData: { original: text },
                    translatePosition: rect,
                })
            )
            setenceMarker.highlight(range)
            observer.observe('translate', coparent)
        }

        const handleContentMessage = (data: InjectMessage) => {
            console.log('content message', data)
            switch (data.type) {
                case 'lookupRange':
                    handleLookupRangeMessage(data.payload.range)
                    break
                case 'translateRange':
                    handleTranslateRangeMessage(data.payload.range)
                    break
                case 'anchor':
                    dispatch(
                        setState({
                            anchorUrl: data.payload.url,
                            anchorTitle: data.payload.title,
                            anchorVisible: true,
                            anchorElement: data.payload.element,
                        })
                    )
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
                    break
                case 'setCoverVisible':
                    dispatch(setState({ coverVisible: data.payload.visible }))
                    break
            }
        }

        const removeListener = addContentMessageListener(handleContentMessage)

        return () => {
            removeListener()
        }
    }, [])
}
