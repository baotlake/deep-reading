import { eventCollect } from '@wrp/core'
import { getManifest, setUninstallURL } from "../uitls/extension"
import { setCoverVisible } from '../uitls/setting'
import { createMenu } from './contextMenus'


type InstalledDetails = chrome.runtime.InstalledDetails

export function handleInstalled(details: InstalledDetails) {
    console.log('handleInstalled', details)

    if (details.reason === 'install') {
        eventCollect({
            ec: 'extension',
            ea: 'install',
            el: 'Install',
            ev: 1,
        })
    }

    if (details.reason === 'update') {
        eventCollect({
            ec: 'extension',
            ea: 'update',
            el: 'Update-' + getManifest().version,
            ev: 1,
        })
    }

    createMenu()

    setUninstallURL('https://wrp.netlify.app/extension/survey')
}

export function handleStartup() {
    console.log('handleStartup')
    setCoverVisible(-1, false)

    eventCollect({
        ec: 'extension',
        ea: 'startup',
        el: 'Startup',
        ev: 1,
    })

    createMenu()
}