import type { TriggerMode } from '@wrp/core'
import type { Action } from './actions'

type ScopeTab = 'global' | 'host'
type Tab = chrome.tabs.Tab

export const initialState = {
    enable: true,
    scope: 'global' as ScopeTab,
    activeTab: null as null | Tab,
    hostname: '',
    globalTriggerMode: 'article' as TriggerMode,
    hostTriggerMode: 'article' as TriggerMode,
    hostCustomized: false,
}

export type State = typeof initialState

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