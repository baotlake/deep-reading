
import type { TriggerMode } from '@wrp/core'

type Config = {
    triggerMode: TriggerMode
    preventClickLink: boolean
}

export let triggerMode: TriggerMode = 'disable'
export let preventClickLink = false

export const config: Config = {
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
    }
}
