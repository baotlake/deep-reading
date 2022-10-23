import React, { forwardRef } from 'react'
import Card from './Card'
import Box from './Box'
import { useIsBottomSheet } from '../../hooks'

type Props = {
    visible: boolean
    data: any
    rect?: DOMRect | null
    onClose?: () => void
    pin?: 'sheet' | 'modal',
}

function Translation(
    { visible, data, rect, onClose, pin }: Props,
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
                />
            }
        </>
    )
}

export default forwardRef<HTMLDivElement, Props>(Translation)