import { useEffect, useRef } from 'react'

export function useObserver() {
    const ref = useRef({
        observe: (label: string, el: HTMLElement) => { },
        unobserve: (label: string) => { },
        target: new Map<string, Element>(),
        labelMap: new WeakMap<Element, string[]>(),
        callback: (label: string, entry: IntersectionObserverEntry) => { },
    })

    useEffect(() => {
        const { labelMap } = ref.current
        const o = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    o.unobserve(entry.target)
                    o.observe(entry.target)
                }

                const labels = labelMap.get(entry.target)
                if (!labels) return
                labels.forEach((label) => {
                    ref.current.callback(label, entry)
                })
            })

        })

        const observe = (label: string, el: HTMLElement) => {
            const { target, labelMap } = ref.current
            if (label && target.has(label)) {
                o.unobserve(target.get(label) as HTMLElement)
            }
            target.set(label, el)
            const labels = labelMap.get(el)
            labels
                ? labelMap.set(el, [...labels, label])
                : labelMap.set(el, [label])
            o.observe(el)
        }

        const unobserve = (label: string) => {
            const { target, labelMap } = ref.current
            const el = target.get(label)
            if (el) {
                target.delete(label)
                const labels = labelMap.get(el)
                labelMap.set(
                    el,
                    labels ? labels.filter((v) => v !== label) : []
                )
                o.unobserve(el)
            }
        }

        Object.defineProperty(ref.current, 'target', {
            value: ref.current.target,
            writable: false,
        })
        Object.defineProperty(ref.current, 'labelMap', {
            value: ref.current.labelMap,
            writable: false,
        })
        Object.defineProperty(ref.current, 'observe', {
            value: observe,
            writable: false,
        })
        Object.defineProperty(ref.current, 'unobserve', {
            value: unobserve,
            writable: false,
        })

        return () => {
            o.disconnect()
        }
    }, [])

    return ref.current
}
