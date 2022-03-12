import React, { forwardRef, useEffect, useState } from 'react'
import Card from './Card'
import Box from './Box'


type Props = {
    visible: boolean
    data: any
    rect?: DOMRect
    onClose?: () => void
}

function Translation(
    { visible, data, rect, onClose }: Props,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const [card, setCard] = useState(true)

    useEffect(() => {

        const setMode = () => {
            const touchscreen = navigator.maxTouchPoints > 0
            const viewWidth = Math.min(window.innerWidth, window.screen.width)

            const pass = touchscreen && viewWidth < 650
            pass && !card && setCard(true)
            !pass && card && setCard(false)
        }

        if (visible) {
            setMode()
        }

        visible && window.addEventListener('resize', setMode)
        return () => {
            visible && window.addEventListener('resize', setMode)
        }

    }, [visible, card])

    return (
        <>
            {
                card ? <Card
                    visible={visible}
                    data={data}
                    onClose={onClose}
                /> : <Box
                    ref={ref}
                    visible={visible}
                    data={data}
                    onClose={onClose}
                    positionRect={rect}
                />
            }
        </>
    )
}

export default forwardRef<HTMLDivElement, Props>(Translation)