import { useEffect } from 'react'

export function useEscapeHide(visible: boolean, onClose?: (value: boolean) => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == 'Escape') {
                onClose && onClose(false)
            }
        }
        if (visible) {
            window.addEventListener('keydown', handleKeyDown)
            return () => {
                window.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [visible, onClose])
}
