import React, { forwardRef } from 'react'
import Card from './Card'
import Box from './Box'
import { useIsBottomSheet } from '../../hooks'

type Props = {
    visible: boolean
    data: any
    rect?: DOMRect | null
    onClose?: () => void
    pin?: 'sheet' | 'modal'
    outbound?: boolean
}

function Translation(
    { visible, data, rect, onClose, pin, outbound }: Props,
    ref: React.ForwardedRef<HTMLDivElement | null>
) {

    const forceValue = pin === 'sheet' ? true : pin === 'modal' ? false : undefined
    const isBottomSheet = useIsBottomSheet(forceValue)

    return (
        <>
            {
                isBottomSheet ? <Card
                    ref={ref}
                    visible={visible}
                    data={data}
                    onClose={onClose}
                /> : <Box
                    ref={ref}
                    visible={visible}
                    data={data}
                    onClose={onClose}
                    position={rect}
                    outbound={outbound}
                />
            }
        </>
    )
}

export default forwardRef<HTMLDivElement, Props>(Translation)