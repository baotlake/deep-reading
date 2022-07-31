
export function matchChatVisiblePath(path?: string) {
    const visiblePattern = /\/about/
    const invisiblePattern = /^\/reading|^\/word|^\/start/
    const visible = !invisiblePattern.test(path || '')

    return visible
}