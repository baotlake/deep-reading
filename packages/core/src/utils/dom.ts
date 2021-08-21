

export function nodePath(target: Node) {
    const path = []
    while (target) {
        path.push(target)
        target = target.parentNode
    }
    return path
}
