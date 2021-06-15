import {
    CSSProperties,
    useState,
    useEffect,
    useRef,
    TouchEventHandler,
    useCallback,
} from 'react'

import styles from './translation.scss?raw'

interface Props {
    visible: boolean | number
    onClose?: () => void
    data: any
    original?: any
    translation?: any
}

export default function Translation({
    visible,
    data,
    original,
    translation,
    onClose,
}: Props) {
    const translationEl = useRef<HTMLDivElement>()
    const state = useRef({
        height: 0,
        moving: false,
        startY: 0,
        startTimeStamp: 0,
        translateY: 0,
        speed: 0,
    })

    const translateY = (value: number) => {
        if (value > -state.current.height - 1 && value <= 0) {
            translationEl.current.style.transform = `translateY(${value}px)`
        }
    }

    const handleScrollEnd = () => {
        state.current.translateY = parseInt(
            translationEl.current.style.transform.slice(11, -3) || '0'
        )
        console.log('handle scroll end', state.current.translateY)

        if (state.current.translateY > -180) {
            transitionTo(state.current.translateY, 0).then(() => {
                if (typeof onClose === 'function') onClose()
                console.log('Close!')
            })
        }
    }

    const transitionTo = (from: number, to: number) => {
        state.current.translateY = from

        return new Promise((resolve) => {
            const refresh = () => {
                if (state.current.translateY + 8 <= to) {
                    state.current.translateY += 8
                    translateY(state.current.translateY)
                    requestAnimationFrame(refresh)
                } else {
                    translateY(to)
                    resolve(true)
                }
            }

            refresh()
        })
    }

    useEffect(() => {
        let rect = translationEl.current.getBoundingClientRect()
        state.current.height = rect.height

        const handleTouchStart = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            let y = e['screenY'] || e['touches'][0].screenY

            let rect = translationEl.current.getBoundingClientRect()
            state.current.height = rect.height
            state.current.moving = true
            state.current.startY = y
            state.current.startTimeStamp = e.timeStamp
            state.current.translateY = parseInt(
                translationEl.current.style.transform.slice(11, -3) || '0'
            )
            state.current.speed = 0
        }
        const handleTouchMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            let stateData = state.current
            let y = e['screenY'] || e['touches'][0].screenY
            if (stateData.moving) {
                let offset = y - stateData.startY + stateData.translateY
                translateY(offset)
                state.current.speed =
                    (y - state.current.startY) /
                    (e.timeStamp - state.current.startTimeStamp)
            }
        }
        const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('e', e, state.current.speed)
            state.current.moving = false
            state.current.translateY = parseInt(
                translationEl.current.style.transform.slice(11, -3)
            )

            inertiaMove(state.current.speed)
        }
        const inertiaMove = (speed: number) => {
            let duration = Math.sqrt((Math.abs(speed) + 1) * 20000)
            console.log('duration', duration, speed)
            let t1 = Date.now()

            const refresh = () => {
                let spend = Date.now() - t1
                if (spend <= duration) {
                    let offset = state.current.translateY + spend * speed
                    translateY(offset)
                    window.requestAnimationFrame(refresh)
                } else {
                    handleScrollEnd()
                }
            }

            refresh()
        }

        const translation = translationEl.current
        translation.addEventListener('touchstart', handleTouchStart, {
            passive: false,
        })
        translation.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        })
        translation.addEventListener('touchend', handleTouchEnd, {
            passive: false,
        })

        translation.addEventListener('mousedown', handleTouchStart)
        translation.addEventListener('mousemove', handleTouchMove)
        translation.addEventListener('mouseup', handleTouchEnd)

        return () => {
            translation.removeEventListener('touchstart', handleTouchStart)
            translation.removeEventListener('touchmove', handleTouchMove)
            translation.removeEventListener('touchend', handleTouchEnd)
        }
    }, [])

    useEffect(() => {
        if (visible === true) {
            translateY(-state.current.height / 2)
        }

        if (visible === false) {
            translateY(0)
        }
    }, [visible])

    return (
        <>
            <style>{styles}</style>
            <div
                ref={translationEl}
                className="wrp-translation"
                // onClick={props.handleClick}
            >
                <div
                    className="handle"
                    // onClick={props.setTranslateY}
                >
                    <div />
                </div>

                <div className="">{data.original}</div>
                <br />
                <div className="">{data.translation}</div>
            </div>
        </>
    )
}
