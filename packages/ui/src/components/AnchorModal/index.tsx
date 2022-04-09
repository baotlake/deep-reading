import React, { useEffect, useRef } from 'react'
import classNames from "classnames"
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded'
import { Box, UrlBox, GoButton } from './index.style'

interface Props {
    visible: boolean
    title?: string
    url: string
    onClose?: () => void
    onGo?: (url: string, blank: boolean) => void
}

export function AnchorModal({ visible, title, url, onClose, onGo }: Props) {

    const dataRef = useRef({
        touchStartAt: 0,
        touch: false,
    })

    useEffect(() => {
        let timeoutId: number

        const delayClose = () => {
            timeoutId = window.setTimeout(() => {
                if (dataRef.current.touch) {
                    return delayClose()
                }
                onClose && onClose()
            }, 3000)
        }

        if (visible) {
            delayClose()
        }

        return () => {
            clearTimeout(timeoutId)
        }
    }, [visible, onClose])

    const handleTouchStart = () => {
        dataRef.current.touchStartAt = Date.now()
        dataRef.current.touch = true
        setTimeout(() => {
            dataRef.current.touch && navigator.vibrate(50)
        }, 240)
    }

    const handleTouchEnd = (e: React.MouseEvent | React.TouchEvent) => {
        console.log(e)
        const duration = Date.now() - dataRef.current.touchStartAt
        const longPress = duration >= 240 && duration <= 2400
        console.log('duration ', duration)
        const leave = e.metaKey || longPress

        onGo && onGo(url, leave)
    }

    const handleTextTouchEnd = (e: React.MouseEvent | React.TouchEvent) => {
        const duration = Date.now() - dataRef.current.touchStartAt
        const longPress = duration >= 240 && duration <= 2400

        longPress && navigator.clipboard?.writeText(url)
        !longPress && onGo && onGo(url, false)
    }

    return (
        <Box
            className={
                classNames('anchor-modal', {
                    visible: visible
                })
            }
            data-wrp-action="no-lookup no-translate"
        >
            <UrlBox
                // onClick={handleTextClick}
                onTouchStart={handleTouchStart}
                onMouseDown={handleTouchStart}
                onTouchEnd={(e) => {
                    dataRef.current.touch = false
                    handleTextTouchEnd(e)
                }}
                onMouseUp={(e) => {
                    dataRef.current.touch = false
                    handleTextTouchEnd(e)
                }}
                onTouchCancel={() => {
                    dataRef.current.touch = false
                }}
            >
                <span>
                    {
                        title ? title
                            : /https?:\/\//.test(url)
                                ? new URL(url).hostname
                                : url
                    }
                </span>
                <pre>{url}</pre>
            </UrlBox>
            <GoButton
                // onClick={handleClick}
                variant="contained"
                onTouchStart={handleTouchStart}
                onMouseDown={handleTouchStart}
                onTouchEnd={(e) => {
                    dataRef.current.touch = false
                    handleTouchEnd(e)
                }}
                onMouseUp={(e) => {
                    dataRef.current.touch = false
                    handleTouchEnd(e)
                }}
                onTouchCancel={() => {
                    dataRef.current.touch = false
                }}
            >
                <ArrowCircleRightRoundedIcon fontSize='medium' />
            </GoButton>
        </Box>
    );
}
