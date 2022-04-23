
import { ReactNode, useEffect, useRef } from 'react'
import { styled } from '@mui/system'

export const SwipeView = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
})

const Box = styled('div')({
    position: 'relative',
    width: '100%',
    height: '100%',

    '> div:first-child': {
        transform: 'translateX(-100%)',
    },

    '> div:last-child': {
        transform: 'translateX(100%)',
    },

    '> div:nth-of-type(2n)': {
        color: 'red',
    }
})


type Props = {
    children: [ReactNode, ReactNode, ReactNode]
    index?: number
    onChange?: (value: number) => void
}

export function SwipeableView({ children, index, onChange }: Props) {

    const divEl = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<Record<string, number>>({})

    useEffect(() => {
        const div = divEl.current
        let moveCount = 0
        let triggered = false
        let start = [0, 0]
        let end = [0, 0]

        let deltaXSum = 0
        let wheelDelayId: number

        const rect = div?.getBoundingClientRect()

        const handleTouchStart = (e: TouchEvent) => {
            start = [e.touches[0].clientX, e.touches[0].clientY]
            moveCount = 0
            triggered = false
        }

        const handleTouchMove = (e: TouchEvent) => {
            end = [e.touches[0].clientX, e.touches[0].clientY]
            moveCount++

            if (
                moveCount < 10
                && !triggered
                && Math.abs(end[0] - start[0]) > 12
                && Math.abs(end[1] - start[1]) < 8
            ) {
                triggered = true
            }

            if (triggered && div) {
                div.style.transform = 'translateX(' + (end[0] - start[0]) + 'px)'
            }
        }

        const handleTouchEnd = (e: TouchEvent) => {
            if (!triggered || !div) return
            div.style.transition = 'transform 0.3s'

            const offset = end[0] - start[0]

            if (Math.abs(offset) > 80) {
                div.style.transform = 'translateX(' + Math.sign(offset) * 100 + '%)'
                setTimeout(() => {
                    onChange && onChange(-Math.sign(offset))
                    div.style.transition = ''
                    div.style.transform = 'translateX(0)'
                }, 300)

                return
            }

            div.style.transform = 'translateX(0)'
            setTimeout(() => {
                div.style.transition = ''
            }, 300)
        }

        const wheelDelay = () => {
            const dx = deltaXSum
            deltaXSum = 0
            if (!div) return
            div.style.transition = 'transform 0.2s'
            if (rect && Math.abs(dx) > rect.width / 2) {
                div.style.transform = 'translateX(' + -Math.sign(dx) * 100 + '%)'

                wheelDelayId = window.setTimeout(() => {
                    console.log('wheel onchange')
                    onChange && onChange(Math.sign(dx))
                    div.style.transition = ''
                    div.style.transform = 'translateX(0)'
                }, 300)

                return
            }

            div.style.transform = 'translateX(0)'
            setTimeout(() => {
                div.style.transition = ''
            }, 200)

        }

        const handleWheel = (e: WheelEvent) => {
            const { deltaX, deltaY } = e
            if (div && Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault()
                deltaXSum += deltaX / 3
                div.style.transform = 'translateX(' + (-deltaXSum) + 'px)'

                if (rect && Math.abs(deltaXSum) >= rect.width) {
                    onChange && onChange(Math.sign(deltaXSum))
                    div.style.transform = 'translateX(0)'
                    deltaXSum = 0
                    return
                }
                clearTimeout(wheelDelayId)
                wheelDelayId = window.setTimeout(wheelDelay, 200)
            }
        }

        if (div) {
            div.addEventListener('touchstart', handleTouchStart, { passive: true })
            div.addEventListener('touchmove', handleTouchMove, { passive: true })
            div.addEventListener('touchend', handleTouchEnd, { passive: true })
            div.addEventListener('wheel', handleWheel)
        }

        return () => {
            if (div) {
                div.removeEventListener('touchstart', handleTouchStart)
                div.removeEventListener('touchmove', handleTouchMove)
                div.removeEventListener('touchend', handleTouchEnd)
                div.removeEventListener('wheel', handleWheel)
            }
        }
    }, [onChange])

    useEffect(() => {
        const div = divEl.current
        const scrollData = scrollRef.current
        const valid = typeof index === 'number' && div

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement
            if (target.parentElement === div) {
                scrollData[index + ''] = target.scrollTop
            }
        }
        if (valid) {
            div.addEventListener('scroll', handleScroll, { capture: true, passive: true })

            if (isFinite(scrollData[index - 1])) {
                div.children[0]?.scrollTo({
                    top: scrollData[index - 1]
                })
            }
            if (isFinite(scrollData[index + 1])) {
                div.children[2]?.scrollTo({
                    top: scrollData[index + 1]
                })
            }
        }
        return () => {
            if (valid) {
                div.removeEventListener('scroll', handleScroll, { capture: true })
            }
        }
    }, [index])

    return (
        <Box ref={divEl}>
            {children}
        </Box>
    )
}