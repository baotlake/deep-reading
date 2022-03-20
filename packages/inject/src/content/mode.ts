
import { TriggerMode } from '@wrp/core'

export let mode: TriggerMode = 'disable'

export function setMode(newMode: TriggerMode) {
    mode = newMode
}

