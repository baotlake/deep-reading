import { TargetType, isArticleContent } from '@wrp/core'
import { options } from './options'
import { Action } from '../type'

type ComposedPath = NonNullable<Event['target']>[]

export function deltaFilter(actions: Action[], deltaT: number, deltaD: number) {
    return actions.map((v) => {
        switch (v) {
            case 'lookup':
            case 'link':
                return deltaT < 300 && deltaD < 3
            case 'translate':
                return deltaT >= 300 && deltaT <= 1500 && deltaD < 3
            default:
                return false
        }
    })
}

export function actionsFilter(actions: Action[], path: ComposedPath) {
    return actions.map(v => actionFilter(path, v))
}

export function actionFilter(path: ComposedPath, action: Action): boolean {
    const target = path[0]
    switch (target instanceof Element && target.nodeName) {
        case 'INPUT':
            return false
    }

    for (let node of path) {
        if (!(node instanceof Element)) continue
        const policy = node.getAttribute('data-wrp-action') || ''
        if (!policy) continue
        if (policy.search('no-' + action) !== -1) {
            return false
        }
        if (policy.search(action) !== -1) {
            return true
        }
    }
    return true
}

export function targetFilter(path: ComposedPath, type: TargetType): boolean {
    switch (type) {
        case 'all':
            return true
        case 'main':
            return isArticleContent(path)
        case 'none':
            return options.coverVisible
        default:
            return false
    }
}

export function wordFilter(word: string) {
    word = word.trim()
    if (word.length < 1) return false
    // 不含有字母数字 not contains numbers or letters
    if (!/\w/.test(word)) return false
    return true
}
