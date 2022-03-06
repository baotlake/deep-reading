import type { TriggerMode } from '@wrp/core'
import type { State } from './reducer'

type ActionType =
    'setEnable'
    | 'setActiveTab'
    | 'setScope'
    | 'setMode'
    | 'setGlobalTriggerMode'
    | 'setHostTriggerMode'

interface ActionInterface<T = any> {
    type: ActionType
    payload: T
}

export function setEnable(value: boolean): ActionInterface {
    return {
        type: 'setEnable',
        payload: {
            enable: value,
        }
    }
}

export function setActiveTab(tab: chrome.tabs.Tab): ActionInterface {

    const url = new URL(tab.url)
    return {
        type: 'setActiveTab',
        payload: {
            activeTab: tab,
            hostname: url.hostname,
        }
    }
}

export function setScope(value: State['scope']): ActionInterface {

    return {
        type: 'setScope',
        payload: {
            scope: value,
        }
    }
}

export function setMode(global: TriggerMode, host: TriggerMode, customized: boolean): ActionInterface {
    return {
        type: 'setMode',
        payload: {
            globalTriggerMode: global,
            hostTriggerMode: host,
            hostCustomized: customized,
            scope: customized ? 'host' : 'global'
        }
    }
}

export function setGlobalTriggerMode(mode: TriggerMode): ActionInterface {

    return {
        type: 'setGlobalTriggerMode',
        payload: {
            globalTriggerMode: mode,
        }
    }
}

export function setHostTriggerMode(mode: TriggerMode, customized: boolean): ActionInterface {
    return {
        type: 'setHostTriggerMode',
        payload: {
            hostTriggerMode: mode,
            hostCustomized: customized,
        }
    }
}



type ActionsFunction =
    typeof setEnable
    | typeof setActiveTab
    | typeof setScope
    | typeof setMode
    | typeof setGlobalTriggerMode
    | typeof setHostTriggerMode


export type Action = ReturnType<ActionsFunction>