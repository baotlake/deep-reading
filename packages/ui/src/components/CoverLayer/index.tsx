import React, { useRef, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import classNames from 'classnames'
import { Box, CloseButton } from './index.style'

const LONG_PRESS_TIME = 360

type Props = {
    onClose?: () => void
}

export function CoverLayer({ onClose }: Props) {
    const [passEvent, setPassEvent] = useState(false)
    const divEl = useRef<HTMLDivElement>(null)
    const dataRef = useRef({
        pointerEvents: true,
        whellTimeoutId: -1,
    })

    useEffect(() => {
        let keyDownTimeStamp = 0
        let isKeyUp = true
        let keyDownTimeoutId = -1

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isKeyUp && e.key == 'Escape') {
                keyDownTimeStamp = e.timeStamp
                isKeyUp = false
                setPassEvent(true)
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                isKeyUp = true
                setPassEvent(false)
                if (e.timeStamp - keyDownTimeStamp < LONG_PRESS_TIME) {
                    clearTimeout(keyDownTimeoutId)
                    onClose && onClose()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])


    const handleWheel = () => {
        const { pointerEvents, whellTimeoutId } = dataRef.current
        const div = divEl.current
        if (pointerEvents && div) {
            // div.style.pointerEvents = 'none'
            div.classList.add('wheel-through')
            dataRef.current.pointerEvents = false
        }

        clearTimeout(whellTimeoutId)
        dataRef.current.whellTimeoutId = window.setTimeout(() => {
            if (div) {
                // div.style.pointerEvents = 'all'
                div.classList.remove('wheel-through')
            }
            dataRef.current.pointerEvents = true
        }, 200)
    }

    return (
        <Box
            ref={divEl}
            className={classNames({ through: passEvent })}
            onWheel={handleWheel}
            onTouchMove={handleWheel}
            data-wrp-cover="true"
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