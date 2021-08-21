type Action = 'look-up' | 'translate'

export function actionFilter(path: Element[], action: Action) {
    for (let node of path) {
        if (!node.attributes) continue
        let policy = node.getAttribute('wrp-action') || ''
        if (policy.search(`no-${action}`) !== -1) {
            return false
        }
        if (policy.search(action) !== -1) {
            return true
        }
    }
    return true
}
