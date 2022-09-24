import { WordData } from "../../core/es"

export function matchChatVisiblePath(path?: string) {
    const visiblePattern = /\/about/
    const invisiblePattern = /^\/reading|^\/word|^\/start/
    const visible = !invisiblePattern.test(path || '')

    return visible
}

type OrderType = 'recent' | 'earliest' | 'a-z' | 'z-a'
export function wordSortCompareFn(orderType: OrderType) {
    return (first: Partial<WordData>, second: Partial<WordData>) => {
        const firstChar = (first?.word || '#').slice(0, 1)
        const secondChar = (second?.word || '#').slice(0, 1)
        switch (orderType) {
            case 'a-z':
                return firstChar.charCodeAt(0) - secondChar.charCodeAt(0)
            case 'z-a':
                return secondChar.charCodeAt(0) - firstChar.charCodeAt(0)
            case 'recent':
                return (second.timestamp || 0) - (first.timestamp || 0)
            case 'earliest':
                return (first.timestamp || 0) - (second.timestamp || 0)
            default:
                return 0
        }
    }
}