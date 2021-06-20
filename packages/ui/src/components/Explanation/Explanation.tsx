import { forwardRef, ForwardedRef, useEffect, useRef, useState } from 'react'
import SvgBorder from './SvgBorder'
import Pronunciation from './Pronunciation'
import Answer from './Answer'
import { WordData } from '@wrp/core'
import Skeleton from '@material-ui/lab/Skeleton'

import style from './explanation.scss?raw'

interface Props {
    visible: boolean
    data: Partial<WordData>
    position: [number, number]
    zoom?: number
    onClose?: () => void
}

interface PositionState {
    left: number
    top: number
    rx: number
    direction: 'up' | 'down'
}

export default forwardRef(function Explanation(
    { visible, data, position, onClose, zoom }: Props,
    ref: ForwardedRef<HTMLDivElement>
) {
    if (!data) data = {}
    const innerRef = useRef<HTMLDivElement>()
    const refData = useRef({
        width: 255,
        height: 120,
        windowWidth: 1080,
        windowHeight: 1920,
        arrowHeight: 30, // SVGBorder Arrow Height
        margin: 15,
    })

    const [positionState, setPositionState] = useState<PositionState>({
        left: 0,
        top: 0,
        rx: 0.5,
        direction: 'up',
    })

    useEffect(() => {
        const calcPosition = () => {
            const x = position[0]
            const y = position[1]
            const width = refData.current.width
            const height = refData.current.height
            const windowWidth = refData.current.windowWidth
            const arrowHeight = refData.current.arrowHeight
            const margin = refData.current.margin

            let rx = 0.5
            let left = x - width / 2
            if (x < margin + width / 2) {
                rx = (x - margin) / width
                left = margin
            }
            if (x > windowWidth - margin - width / 2) {
                rx = 1 - (windowWidth - x - margin) / width
                left = windowWidth - margin - width
            }

            let direction: 'up' | 'down' = 'up'
            let top = y - height - arrowHeight
            if (y < height + margin + arrowHeight) {
                direction = 'down'
                top = y + arrowHeight
            }

            return {
                left,
                top,
                rx,
                direction,
            }
        }

        if (position) setPositionState(calcPosition())
    }, [position])

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(innerRef.current)
        } else if (ref !== null) {
            ref.current = innerRef.current
        }
    }, [ref])

    useEffect(() => {
        refData.current.windowWidth = window.innerWidth
        refData.current.windowHeight = window.innerHeight
        let rect = innerRef.current.getBoundingClientRect()
        refData.current.width = rect.width
        refData.current.height = rect.height
    }, [])

    return (
        <div
            ref={innerRef}
            className={
                'wrp-explanation' +
                (!visible ? ` hidden-${positionState.direction}` : '')
            }
            style={{
                left: positionState.left,
                top: positionState.top,
            }}
        >
            <div className="border-box">
                <SvgBorder
                    ratioX={positionState.rx}
                    direction={positionState.direction}
                />
            </div>
            <style>{style}</style>
            <div className="main-contianer">
                <div className="header">
                    <div className="word">{data.word}</div>
                </div>
                <div className="content">
                    <dl>
                        {data.state === 'loading' && (
                            <>
                                <Skeleton
                                    variant="text"
                                    width={refData.current.width * 0.6}
                                    height={18}
                                />
                                <Skeleton
                                    variant="text"
                                    width={refData.current.width * 0.4}
                                    height={18}
                                />
                                <Skeleton
                                    variant="text"
                                    width={refData.current.width * 0.8}
                                    height={18}
                                />
                            </>
                        )}
                        <dt>
                            <Pronunciation data={data.pronunciation} />
                        </dt>
                        <Answer answer={data.answer} />
                    </dl>
                </div>
            </div>
            <div role="button" className="close" onClick={() => onClose()}>
                <div />
            </div>
        </div>
    )
})
