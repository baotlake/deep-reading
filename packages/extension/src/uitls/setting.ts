import type { TriggerMode } from '@wrp/core'
import { defaultTriggerMode } from './config'
import {
    getSyncStorage,
    setSyncStorage,
    getLocalStorage,
    setLocalStorage
} from './extension'
import { HOST_MODE_KEY, ENABLE_KEY, COVER_KEY } from './key'

export async function getEnable() {
    const { [ENABLE_KEY]: enable } = await getSyncStorage<boolean>({
        [ENABLE_KEY]: true
    })
    return enable
}

export function setEnable(value: boolean) {
    setSyncStorage({ [ENABLE_KEY]: value })
}

type HostMode = {
    mode: TriggerMode
    customized: boolean
}

export async function getHostMode(hosts: string[]): Promise<HostMode[]> {
    const { [HOST_MODE_KEY]: setting } = await getSyncStorage<typeof defaultTriggerMode>({
        [HOST_MODE_KEY]: defaultTriggerMode
    })

    return hosts.map((name) => {
        const mode = setting[name]
        return {
            mode: mode || setting['*'],
            customized: !!mode,
        }
    })
}

export async function setHostMode(host: string, mode?: TriggerMode) {
    const { [HOST_MODE_KEY]: setting } = await getSyncStorage<typeof defaultTriggerMode>({
        [HOST_MODE_KEY]: defaultTriggerMode
    })
    if (mode) {
        setting[host] = mode
    } else {
        delete setting[host]
    }
    setSyncStorage({
        [HOST_MODE_KEY]: setting,
    })
}

export async function getCoverVisible(tabId: number) {
    const { [COVER_KEY]: cover } = await getLocalStorage({
        [COVER_KEY]: {}
    })
    if (cover[tabId] === true) return true
    return false
}

export async function setCoverVisible(tabId: number, visible: boolean) {
    let { [COVER_KEY]: cover } = await getLocalStorage({
        [COVER_KEY]: {}
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

    await setLocalStorage({
        [COVER_KEY]: cover
    })
}