import {
    useEffect,
    useRef,
    forwardRef,
} from 'react'
import classNames from 'classnames'

import styles from './translation.scss?raw'

interface Props {
    visible: boolean | number
    onClose?: () => void
    data: any
}

export default forwardRef(function Translation(
    {
        visible,
        data,
        onClose,
    }: Props, ref) {
    const translationEl = useRef<HTMLDivElement>()
    const refData = useRef({
        height: 0,
        moving: false,
        startY: 0,
        startTimeStamp: 0,
        translateY: 0,
        speed: 0,
    })

    const translateY = (value: number) => {
        if (value > -refData.current.height - 1 && value <= 0) {
            translationEl.current.style.transform = `translateY(${value}px)`
        }
    }

    const handleScrollEnd = () => {
        refData.current.translateY = parseInt(
            translationEl.current.style.transform.slice(11, -3) || '0'
        )
        console.log('handle scroll end', refData.current.translateY)

        if (refData.current.translateY > -180) {
            transitionTo(refData.current.translateY, 0).then(() => {
                if (typeof onClose === 'function') onClose()
                console.log('Close!')
            })
        }
    }

    const transitionTo = (from: number, to: number) => {
        refData.current.translateY = from

        return new Promise((resolve) => {
            const refresh = () => {
                if (refData.current.translateY + 8 <= to) {
                    refData.current.translateY += 8
                    translateY(refData.current.translateY)
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
        refData.current.height = rect.height

        const handleTouchStart = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            let y = (e as MouseEvent).screenY || (e as TouchEvent)['touches'][0].screenY

            let rect = translationEl.current.getBoundingClientRect()
            refData.current.height = rect.height
            refData.current.moving = true
            refData.current.startY = y
            refData.current.startTimeStamp = e.timeStamp
            refData.current.translateY = parseInt(
                translationEl.current.style.transform.slice(11, -3) || '0'
            )
            refData.current.speed = 0
        }
        const handleTouchMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            let stateData = refData.current
            let y = (e as MouseEvent).screenY || (e as TouchEvent)['touches'][0].screenY
            if (stateData.moving) {
                let offset = y - stateData.startY + stateData.translateY
                translateY(offset)
                refData.current.speed =
                    (y - refData.current.startY) /
                    (e.timeStamp - refData.current.startTimeStamp)
            }
        }
        const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('e', e, refData.current.speed)
            refData.current.moving = false
            refData.current.translateY = parseInt(
                translationEl.current.style.transform.slice(11, -3)
            )

            inertiaMove(refData.current.speed)
        }
        const inertiaMove = (speed: number) => {
            let duration = Math.sqrt((Math.abs(speed) + 1) * 20000)
            console.log('duration', duration, speed)
            let t1 = Date.now()

            const refresh = () => {
                let spend = Date.now() - t1
                if (spend <= duration) {
                    let offset = refData.current.translateY + spend * speed
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
            translateY(-refData.current.height / 2)
        }

        if (visible === false) {
            translateY(0)
        }
    }, [visible])

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(translationEl.current)
        } else if (ref !== null) {
            ref.current = translationEl.current
        }
    }, [ref])

    return (
        <>
            <style>{styles}</style>
            <div
                ref={translationEl}
                className={classNames("wrp-translation", {visible: visible})}
                // onClick={props.handleClick}
            >
                <div
                    className="handle"
                    // onClick={props.setTranslateY}
                >
                    <div/>
                </div>

                <div className="">{data?.original}</div>
                <br/>
                <div className="">{data?.translation}</div>
            </div>
        </>
    )
})
