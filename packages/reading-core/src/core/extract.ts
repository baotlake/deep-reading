

function isInline(target: Node) {
    if (!target) return false
    if (target.nodeName === '#text') return true

    let display = window
        .getComputedStyle(target as Element)
        .getPropertyValue('display')
    if (display.startsWith('inline')) return true
    return false
}




export {}
