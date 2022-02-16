import { TriggerMode } from '@wrp/core'
import { domainMode } from './config'
import { getSyncStorage } from './extension'
import { DOMAIN_MODE_KEY, ENABLE_KEY } from './key'



export async function getEnable() {
    const { [ENABLE_KEY]: enable } = await getSyncStorage<boolean>({ [ENABLE_KEY]: true })
    return enable
}

export async function getDomainMode(host: string) {
    const { [DOMAIN_MODE_KEY]: setting } = await getSyncStorage<typeof domainMode>({ [DOMAIN_MODE_KEY]: domainMode })
    const mode = setting[host]

    return {
        mode: mode || setting['*'],
        own: !!mode,
    }
}

