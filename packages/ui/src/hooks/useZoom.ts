import React, { useState, useEffect } from 'react'

export default function useZoom() {
    const [style, setStyle] = useState<React.CSSProperties>({
        fontSize: 16,
    })


    useEffect(() => {

        const setFontSize = () => {
            const viewportMeta = document.querySelector('meta[name="viewport"]')
            const innerWidth = window.innerWidth
            const screenWidth = window.screen.width

            if (!viewportMeta && innerWidth * 1.2 > screenWidth) {
                setStyle({
                    fontSize: 16 * innerWidth / screenWidth
                })
            } else {
                setStyle({
                    fontSize: 16,
                })
            }
        }

        setFontSize()

        window.addEventListener('resize', setFontSize)

        return () => {
            window.removeEventListener('resize', setFontSize)
        }
    }, [])

    return style
}
