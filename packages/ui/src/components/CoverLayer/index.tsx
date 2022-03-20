import React, { useRef, useEffect } from 'react'

import { alpha } from '@mui/material'
import { styled } from "@mui/system"

const Box = styled('div')(({ theme }) => ({
    background: alpha(theme.palette.primary.main, 0.05),
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    border: `3px dashed ${alpha(theme.palette.primary.main, 0.6)}`
    // pointerEvents: 'none',
}))

export function CoverLayer() {
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

    return (
        <Box
            ref={divEl}
            onWheel={handleWheel}
            onTouchMove={handleWheel}
            data-wrp-cover="true"
        >

        </Box>
    )
}