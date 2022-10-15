import type { TargetType } from '@wrp/core'
import type { Action } from './actions'

type ScopeTab = 'global' | 'host'
type Tab = chrome.tabs.Tab

export type State = {
    enable: boolean
    scope: ScopeTab
    activeTab: null | Tab
    hostname: string
    globalTargetType: TargetType
    hostTargetType: TargetType
    hostCustomized: boolean
}

export const initialState: State = {
    enable: true,
    scope: 'global',
    activeTab: null,
    hostname: '',
    globalTargetType: 'all',
    hostTargetType: 'main',
    hostCustomized: false,
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'setEnable':
        case 'setActiveTab':
        case 'setScope':
        case 'setMode':
        case 'setGlobalTargetType':
        case 'setHostTargetType':
            return { ...state, ...action.payload }
        default:
            return { ...state }
    }
}