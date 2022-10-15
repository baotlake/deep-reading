import type { TargetType } from '@wrp/core'

export const defaultTriggerMode: Record<string, TargetType> = {
    '*': "main"
}

export const contentScripts = ['content.js']

export const storeId = {
    edge: 'acnfkkjcdomnfjdgkmcgilhnnopjbngk',
    firefox: '4adf7e49-9fe5-42d3-af48-0efb83b13fa8',
}
