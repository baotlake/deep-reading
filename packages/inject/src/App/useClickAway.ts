import { Dispatch, RefObject, useEffect } from 'react'
import { setState, Action } from './reducer'
import { useObserver } from '@wrp/ui'
import { MarkPreffix, TransformDiv } from '../type'
import { Marker } from '@wrp/core'

export type ClickAwayRefData = {
    wordMarker: Marker
    setenceMarker: Marker
    explanationRef: RefObject<TransformDiv>
    translateRef: RefObject<TransformDiv>
    observer: ReturnType<typeof useObserver>
    dispatch: Dispatch<Action>
}

function isHighlight(target: Element) {
    if (!target) return false
    if (target.nodeName !== 'MARK') return false

    const preffix: MarkPreffix = 'dr-highlight-'
    return target.className.search(preffix) !== -1
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
            const isInHighlight = isHighlight(target)

            console.log(
                'inject app handle click: ',
                isExplanation,
                isTranslate,
                isInHighlight,
                explanationEl,
                translateEl
            )

            if (explanationVisible && !isExplanation && !isInHighlight) {
                dispatch(setState({ explanationVisible: false }))
            }

            if (
                translateVisible &&
                !isTranslate &&
                !isExplanation &&
                !isInHighlight
            ) {
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
