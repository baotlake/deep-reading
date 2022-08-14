import { useEffect, useState } from 'react'


export function useIsBottomSheet(forceValue?: boolean) {

    const [isBottomSheet, setIsBottomSheet] = useState(true)

    useEffect(() => {
        const setMode = () => {
            const isTouchScreen = navigator.maxTouchPoints > 0
            const viewWidth = Math.min(window.innerWidth, window.screen.width)

            const value = forceValue ?? (isTouchScreen && viewWidth < 650)
            setIsBottomSheet(value)
        }

        setMode()

        window.addEventListener('resize', setMode)

        return () => {
            window.removeEventListener('resize', setMode)
        }
    }, [])

    return isBottomSheet
}