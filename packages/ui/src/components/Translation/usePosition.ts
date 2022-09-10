import React, { useEffect, useState } from 'react'

type Direction = 'up' | 'down'

export default function usePosition(ref: React.RefObject<HTMLDivElement>, position?: DOMRect) {
    const [place, setPlace] = useState({
        left: 100,
        top: 100,
        rx: 0.5,
        direction: 'up' as 'up' | 'down',
    })
    useEffect(() => {
        const [w, h] = [340, 300]
        const m = 30
        const div = ref.current

        if (!div) return

        const calc = () => {
            const [sx, sy] = [window.scrollX, window.scrollY]
            div.style.transform = 'translate(0px,0px)'
            const rect = div.getBoundingClientRect()

            const width = rect?.width || w
            const height = rect?.height || h
            const pageWidth = window.innerWidth + sx

            let textRect = position
            if (!textRect) {
                // default centered
                textRect = DOMRect.fromRect({
                    x: sy + window.innerHeight / 2 - height / 2,
                    y: sx + window.innerWidth / 2 - width / 2,
                    width: width,
                    height: height,
                })
            }

            let rx = 0.5
            let left = textRect.width / 2 + textRect.x - width / 2

            if (left < m) left = m
            const maxLeft = pageWidth - width - m
            if (left > maxLeft) left = maxLeft

            let direction: Direction = 'up'
            let top = textRect.bottom + m
            if (top + height > sy + window.innerHeight - m) {
                direction = 'down'
                top = textRect.top - height - m
            }

            div.style.left = left + 'px'
            div.style.top = top + 'px'

            return {
                left,
                top,
                rx,
                direction,
            }
        }

        setPlace(calc())
    }, [ref, position])

    return place
}