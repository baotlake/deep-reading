
export function matchChatVisiblePath(path?: string) {
    const visiblePattern = /\/about|\/start/
    const invisiblePattern = /^\/reading|^\/word/
    const visible = !invisiblePattern.test(path || '')

    return visible
}