import React, { useRef, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box , CloseButton } from './index.style'

type Props = {
    onClose?: () => void
}

export function CoverLayer({ onClose }: Props) {
    const divEl = useRef<HTMLDivElement>(null)
    const dataRef = useRef({
        pointerEvents: true,
        timeoutId: 0,

    })

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            e.preventDefault()
        }
        window.addEventListener('click', handleClick, true)
        return () => {
            window.removeEventListener('click', handleClick, true)
        }
    }, [])


    const handleWheel = () => {
        const { pointerEvents, timeoutId } = dataRef.current
        const div = divEl.current
        if (pointerEvents && div) {
            div.style.pointerEvents = 'none'
            dataRef.current.pointerEvents = false
        }

        clearTimeout(timeoutId)
        dataRef.current.timeoutId = window.setTimeout(() => {
            if (div) div.style.pointerEvents = 'all'
            dataRef.current.pointerEvents = true
        }, 200)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // console.log(e, e.key, e.code)
        if (e.key === 'Escape') {
            onClose && onClose()
        }
    }

    return (
        <Box
            ref={divEl}
            onWheel={handleWheel}
            onTouchMove={handleWheel}
            data-wrp-cover="true"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <CloseButton
                onClick={onClose}
                aria-label="close"
                size="medium"
            >
                <CloseIcon fontSize="inherit" />
            </CloseButton>
        </Box>
    )
}