import type { TriggerMode } from '@wrp/core'
import { defaultTriggerMode } from './config'
import { getSyncStorage, setSyncStorage } from './extension'
import { HOST_MODE_KEY, ENABLE_KEY } from './key'


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

