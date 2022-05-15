/// <reference path="../../../module.d.ts" />

function now() {
    if (window.performance) {
        return window.performance.now()
    }
    return Date.now()
}

function timingEvent(t1: number, name: string, category?: string, label?: string) {
    const value = Math.round(now() - t1)
    const gtag = window.gtag
    gtag && gtag('event', 'timing_complete', {
        name,
        value,
        event_category: category,
        event_label: label,
    })
}
