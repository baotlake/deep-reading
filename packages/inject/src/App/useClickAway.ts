import { Dispatch, RefObject, useEffect } from 'react'
import { setState, Action } from './reducer'
import { useObserver} from '@wrp/ui'
import { TransformDiv } from '../type'
import { Marker } from '@wrp/core'

export type ClickAwayRefData = {
    wordMarker: Marker
    setenceMarker: Marker
    explanationRef: RefObject<TransformDiv>
    translateRef: RefObject<TransformDiv>
    observer: ReturnType<typeof useObserver>
    dispatch: Dispatch<Action>
}

export function useClickAway(
    ref: RefObject<ClickAwayRefData>,
    explanationVisible: boolean,
    translateVisible: boolean
) {
    useEffect(() => {
        const refData = ref.current
        if (!refData) return

        const {
            wordMarker,
            setenceMarker,
            observer,
            explanationRef,
            translateRef,
            dispatch,
        } = refData

        if (!explanationVisible) {
            wordMarker.delayUnmark()
            observer.unobserve('explanation')
        }
        if (!translateVisible) {
            setenceMarker.delayUnmark()
            observer.unobserve('translate')
        }

        const handleClick = (e: MouseEvent) => {
            const target = e.composedPath()[0] as Element

            const explanationEl = explanationRef.current
            const translateEl = translateRef.current
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
                dispatch(setState({ translateVisible: false }))
            }
        }

        if (!explanationVisible && !translateVisible) return

        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [explanationVisible, translateVisible])
}
