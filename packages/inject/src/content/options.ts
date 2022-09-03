
import type { TriggerMode } from '@wrp/core'

let triggerMode: TriggerMode = 'disable'
let preventClickLink = false

export const options = {
    get triggerMode() {
        return triggerMode
    },
    set triggerMode(mode: TriggerMode) {
        triggerMode = mode
    },

    get preventClickLink() {
        return preventClickLink
    },
    set preventClickLink(value: boolean) {
        preventClickLink = value
    },

}



