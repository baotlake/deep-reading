

export function imgFallback() {
    const handleError = (e: ErrorEvent) => {
        const target = e.target
        if (target instanceof HTMLImageElement && target.dataset.fallback) {
            target.src = target.dataset.fallback
        }
    }

    window.addEventListener('error', handleError, true)

    return () => {
        window.removeEventListener('error', handleError, true)
    }
}
