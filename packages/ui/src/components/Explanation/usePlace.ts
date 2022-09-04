import React, { useState, useEffect } from 'react'

export default function usePlace(ref: React.RefObject<HTMLDivElement>, position: [number, number]) {
    const [place, setPlace] = useState({
        left: 100,
        top: 100,
        rx: 0.5,
        direction: 'up' as 'up' | 'down'
    })

    useEffect(() => {
        const config = {
            width: 255,
            height: 120,
            arrowHeight: 30, // SVGBorder Arrow Height
            margin: 30,
        }
        const calcPosition = () => {
            const x = position[0]
            const y = position[1]
            const [sx, sy] = [window.scrollX, window.scrollY]
            const rect = ref.current?.getBoundingClientRect()

            const width = rect?.width || config.width
            const height = rect?.height || config.height
            const pageWidth = window.innerWidth + sx

            const ratio = (rect?.width || config.width) / config.width
            const arrowHeight = ratio * config.arrowHeight
            const margin = ratio * config.margin

            let rx = 0.5;
            let left = x - width / 2;
            if (x < margin + width / 2) {
                rx = (x - margin) / width
                left = margin
            }
            if (x > pageWidth - margin - width / 2) {
                rx = 1 - (pageWidth - x - margin) / width
                left = pageWidth - margin - width
            }

            let direction: "up" | "down" = "down";
            let top = y - height - arrowHeight;
            if (y - sy < height + margin + arrowHeight) {
                direction = "up";
                top = y + arrowHeight;
            }

            return {
                left,
                top,
                rx,
                direction,
            };
        };

        position && setPlace(calcPosition())
    }, [position])


    return place
}