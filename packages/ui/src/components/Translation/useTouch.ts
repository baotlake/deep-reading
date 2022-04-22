import { useEffect, useRef } from 'react'

type Options = {
    target: HTMLDivElement | null
    bottom: number
    onStop?: (height: number, y: number) => void
}

export function useTouch({ target, bottom, onStop }: Options) {

    const refData = useRef({
        startY: 0,
        startTranslateY: 0,
        startAt: 0,
        moving: false,
        moveSpeed: 0,
        height: 0,
        lastY: 0,
        lastAt: 0,
        translateY: 0,
        speed: 0,
    })

    useEffect(() => {

        if (!target) return

        const translateY = (y: number) => {
            target.style.transform = `translateY(${y}px)`
        }

        const handleTouchStart = (e: TouchEvent | MouseEvent) => {
            const y = e instanceof TouchEvent ? e.touches[0].screenY : e.screenY
            const translateY = parseFloat(target.style.transform.slice(11, -3) || "0")
            const rect = target.getBoundingClientRect()

            const current = refData.current
            current.startY = y
            current.lastY = y
            current.lastAt = e.timeStamp
            current.startTranslateY = translateY
            current.translateY = translateY
            current.moving = true
            current.startAt = e.timeStamp
            current.height = rect.height
            current.speed = 0
        }

        const handleTouchMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            const y = e instanceof TouchEvent ? e.touches[0].screenY : e.screenY
            const { moving, startY, startTranslateY, lastAt, lastY, height } = refData.current

            if (moving) {
                const offsetY = y - startY + startTranslateY
                const out = offsetY > bottom || offsetY < - height - bottom
                if (out) {
                    refData.current.moving = false
                    return
                }
                translateY(offsetY)
                refData.current.translateY = offsetY
                refData.current.lastY = y
                refData.current.lastAt = e.timeStamp
                refData.current.speed = (y - lastY) / (e.timeStamp - lastAt)
            }

        }

        const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
            // const y = e instanceof TouchEvent ? e.touches[0].screenY : e.screenY
            const { moving, speed } = refData.current
            if (moving) {
                refData.current.moving = false
                inertiaMove(speed)
                console.log('speed', speed)
            }

        }

        const inertiaMove = (v1: number) => {
            const start = Date.now()

            const refresh = () => {
                const { moving, translateY: startY, height } = refData.current
                const now = Date.now()
                const t = now - start
                let a = 0.006
                let v2 = v1 - (Math.sign(v1) * a * t)
                let offsetY = startY + t * (v1 + v2) / 2

                const out = offsetY > bottom || offsetY < - height - bottom
                const stop = Math.sign(v2) !== Math.sign(v1) || Math.abs(v1) < a

                console.log('inertiaMove: ', offsetY, v1, v2, stop)

                if (!moving && !stop && !out) {
                    translateY(offsetY)
                    return window.requestAnimationFrame(refresh)
                }

                if (stop || out) {
                    onStop && onStop(height, offsetY)
                }
            }
            refresh()
        }

        target.addEventListener('touchstart', handleTouchStart, { passive: false })
        target.addEventListener('touchmove', handleTouchMove, { passive: false })
        target.addEventListener('touchend', handleTouchEnd, { passive: false })

        target.addEventListener("mousedown", handleTouchStart)
        target.addEventListener("mousemove", handleTouchMove)
        target.addEventListener("mouseup", handleTouchEnd)
        target.addEventListener("mouseleave", handleTouchEnd)

        return () => {
            target.removeEventListener('touchstart', handleTouchStart)
            target.removeEventListener('touchmove', handleTouchMove)
            target.removeEventListener('touchend', handleTouchEnd)

            target.removeEventListener("mousedown", handleTouchStart)
            target.removeEventListener("mousemove", handleTouchMove)
            target.removeEventListener("mouseup", handleTouchEnd)
            target.removeEventListener("mouseleave", handleTouchEnd)

        }
    }, [target])


}