import type { TargetType } from '@wrp/core'
import { defaultTriggerMode } from './config'
import {
    getSyncStorage,
    setSyncStorage,
    getLocalStorage,
    setLocalStorage,
    getSessionStorage,
    setSessionStorage,
} from './extension'
import { LocalStorage, SyncStorage, SessionStorage } from '../types'

type HostMode = {
    mode: TargetType
    customized: boolean
}

export async function getHostMode(hosts: string[]): Promise<HostMode[]> {
    const { host_mode: setting } = await getSyncStorage<SyncStorage>({
        host_mode: defaultTriggerMode
    })

    return hosts.map((name) => {
        const mode = setting[name]
        return {
            mode: mode || setting['*'],
            customized: !!mode,
        }
    })
}

export async function setHostMode(host: string, mode?: TargetType) {
    const { host_mode: setting } = await getSyncStorage<SyncStorage>({
        host_mode: defaultTriggerMode
    })
    if (mode) {
        setting[host] = mode
    } else {
        delete setting[host]
    }
    setSyncStorage<SyncStorage>({
        host_mode: setting,
    })
}

export async function getCoverVisible(tabId: number) {
    const { cover } = await getSessionStorage<SessionStorage>({
        cover: {}
    })
    if (cover[tabId] === true) return true
    return false
}

export async function setCoverVisible(tabId: number, visible: boolean) {
    let { cover } = await getSessionStorage<SessionStorage>({
        cover: {}
    })

    if (visible) {
        cover[tabId] = true
    }
    if (!visible) {
        delete cover[tabId]
        if (tabId === -1) {
            cover = {}
        }
    }

    await setSessionStorage<SessionStorage>({
        cover,
    })
}