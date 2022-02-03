import React, { useEffect, useRef } from 'react'
import classNames from "classnames"
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';

import styles from './index.module.scss'

interface Props {
    visible: boolean
    href: string
    onClose?: () => void
}

export default function AnchorModal({ visible, href, onClose }: Props) {

    const router = useRouter()
    const dataRef = useRef({
        touchStartAt: 0,
        touch: false,
    })

    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        const delayClose = () => {
            timeoutId = setTimeout(() => {
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

        leave && window.open(href, '_blank')
        !leave && router.push('/reading?url=' + encodeURIComponent(href))
    }

    const handleTextTouchEnd = (e: React.MouseEvent | React.TouchEvent) => {
        const duration = Date.now() - dataRef.current.touchStartAt
        const longPress = duration >= 240 && duration <= 2400

        longPress && navigator.clipboard?.writeText(href)
        !longPress && router.push('/reading?url=' + encodeURIComponent(href))
    }

    return (
        <div
            className={
                classNames(styles['anchor-modal'], {
                    [styles['visible']]: visible
                })
            }
            data-wrp-action-block="intercept"
        >
            <div
                className={styles['url']}
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
            >{href}</div>
            <Button
                className={styles['button']}
                // onClick={handleClick}
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
                <ArrowCircleRightRoundedIcon />
            </Button>
        </div>
    );
}
