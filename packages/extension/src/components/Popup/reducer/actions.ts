import type { TargetType } from '@wrp/core'
import type { State } from './reducer'

export function setEnable(value: boolean) {
    return {
        type: 'setEnable' as 'setEnable',
        payload: {
            enable: value,
        }
    }
}

export function setActiveTab(tab: chrome.tabs.Tab) {

    const url = new URL(tab.url)
    return {
        type: 'setActiveTab' as 'setActiveTab',
        payload: {
            activeTab: tab,
            hostname: url.hostname,
        }
    }
}

export function setScope(value: State['scope']) {

    return {
        type: 'setScope' as 'setScope',
        payload: {
            scope: value,
        }
    }
}

export function setMode(global: TargetType, host: TargetType, customized: boolean) {
    return {
        type: 'setMode' as 'setMode',
        payload: {
            globalTargetType: global,
            hostTargetType: host,
            hostCustomized: customized,
            scope: customized ? 'host' : 'global' as 'host' | 'global'
        }
    }
}

export function setGlobalTargetType(mode: TargetType) {

    return {
        type: 'setGlobalTargetType' as 'setGlobalTargetType',
        payload: {
            globalTargetType: mode,
        }
    }
}

export function setHostTargetType(mode: TargetType, customized: boolean) {
    return {
        type: 'setHostTargetType' as 'setHostTargetType',
        payload: {
            hostTargetType: mode,
            hostCustomized: customized,
        }
    }
}



type ActionsFunction =
    typeof setEnable
    | typeof setActiveTab
    | typeof setScope
    | typeof setMode
    | typeof setGlobalTargetType
    | typeof setHostTargetType


export type Action = ReturnType<ActionsFunction>