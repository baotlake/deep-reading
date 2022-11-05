import { useEffect, RefObject, Dispatch } from 'react'
import { setState, Action } from './reducer'
import { detectCSP, client2pageRect } from '@wrp/core'
import { useObserver } from '@wrp/ui'
import { TransformDiv } from '../type'

export type SetupRefData = {
    explanationXY: [number, number]
    translateXY: [number, number]
    explanationOutbound: boolean
    translateOutbound: boolean
    translateRef: RefObject<TransformDiv>
    explanationRef: RefObject<TransformDiv>
    observer: ReturnType<typeof useObserver>
}

export function useSetup(
    ref: RefObject<SetupRefData>,
    dispatch: Dispatch<Action>
) {
    useEffect(() => {
        const refData = ref.current
        if (!refData) return

        const { explanationRef, translateRef, observer } = refData

        const handleOberserCallback = (
            label: string,
            entry: IntersectionObserverEntry
        ) => {
            if (label === 'explanation') {
                const rect = client2pageRect(entry.boundingClientRect)
                const [dx, dy] = [
                    rect.x - refData.explanationXY[0],
                    rect.y - refData.explanationXY[1],
                ]
                explanationRef.current?.transform &&
                    explanationRef.current.transform(dx, dy)

                const outbound = !entry.isIntersecting
                if (outbound !== refData.explanationOutbound) {
                    refData.explanationOutbound = outbound
                    dispatch(setState({ explanationOutbound: outbound }))
                }
            }

            if (label === 'translate') {
                const rect = client2pageRect(entry.boundingClientRect)
                const xy = [rect.left, rect.top]
                const [dx, dy] = [
                    xy[0] - refData.translateXY[0],
                    xy[1] - refData.translateXY[1],
                ]
                translateRef.current?.transform &&
                    translateRef.current.transform(dx, dy)

                const outbound = !entry.isIntersecting
                if (outbound !== refData.translateOutbound) {
                    refData.translateOutbound = outbound
                    dispatch(setState({ translateOutbound: outbound }))
                }
            }
        }

        observer.callback = handleOberserCallback

        detectCSP('media-src').then((directive) => {
            dispatch(setState({ mediaCSPViolation: !!directive }))
        })
    }, [])
}
