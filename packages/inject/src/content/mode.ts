
import { TriggerMode } from '@wrp/core'

export let mode: TriggerMode = 'all'

export function setMode(newMode: TriggerMode) {
    mode = newMode
}

