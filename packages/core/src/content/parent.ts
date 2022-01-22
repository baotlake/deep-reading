
const window = globalThis
let realParent = window.parent

export function getParent() {
    return realParent
}

export function insulate() {
    if (window.parent === globalThis.window) return
    realParent = window.parent
    // @ts-ignore
    window.parent = window
}

