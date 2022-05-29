import type { TriggerMode } from '@wrp/core'

export const defaultTriggerMode: Record<string, TriggerMode> = {
    '*': "main"
}

export const contentScripts = ['content.chunk.js']
