import type { TriggerMode } from '@wrp/core'

export const defaultTriggerMode: Record<string, TriggerMode> = {
    '*': "article"
}

export const contentScripts = ['content.chunk.js']