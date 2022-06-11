import type { TriggerMode } from '@wrp/core'

export const defaultTriggerMode: Record<string, TriggerMode> = {
    '*': "main"
}

export const contentScripts = ['content.chunk.js']

export const storeId = {
    edge: 'acnfkkjcdomnfjdgkmcgilhnnopjbngk',
    firefox: '4adf7e49-9fe5-42d3-af48-0efb83b13fa8',
}
