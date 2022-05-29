import type { TriggerMode } from '@wrp/core'
import type { Action } from './actions'

type ScopeTab = 'global' | 'host'
type Tab = chrome.tabs.Tab

export type State = {
    enable: boolean
    scope: ScopeTab
    activeTab: null | Tab
    hostname: string
    globalTriggerMode: TriggerMode
    hostTriggerMode: TriggerMode
    hostCustomized: boolean
}

export const initialState: State = {
    enable: true,
    scope: 'global',
    activeTab: null,
    hostname: '',
    globalTriggerMode: 'all',
    hostTriggerMode: 'main',
    hostCustomized: false,
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'setEnable':
        case 'setActiveTab':
        case 'setScope':
        case 'setMode':
        case 'setGlobalTriggerMode':
        case 'setHostTriggerMode':
            return { ...state, ...action.payload }
        default:
            return { ...state }
    }
}