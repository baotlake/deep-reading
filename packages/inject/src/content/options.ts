import type { TargetType } from '@wrp/core'

let targetType: TargetType = 'none'
let preventClickLink = false
let coverVisible = false

export const options = {
    get targetType() {
        return targetType
    },
    set targetType(mode: TargetType) {
        targetType = mode
    },

    get preventClickLink() {
        return preventClickLink
    },
    set preventClickLink(value: boolean) {
        preventClickLink = value
    },

    get coverVisible() {
        return coverVisible
    },
    set coverVisible(value: boolean) {
        coverVisible = value
    }
}



