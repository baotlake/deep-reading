import {
    getHostMode,
    setCoverVisible,
    getCoverVisible,
} from "../uitls/setting"
import {
    sendMessageToTab,
    queryTabs,
    getActiveTab,
    executeScript,
    updateTab,
    getSyncStorage,
} from '../uitls/extension'
import { contentScripts } from '../uitls/config'
import { ExtMessageData, SyncStorage } from "../types"
import { MessageData } from '@wrp/core'

type MessageSender = chrome.runtime.MessageSender
type ContentActiveMessage = Extract<ExtMessageData, { type: 'contentActive' }>
export async function handleContentActive(message: ContentActiveMessage, sender: MessageSender) {
    console.log('handleContentActive', message, sender)
    const { id, url } = sender.tab
    if (!id) return

    const urlObj = new URL(url)
    const { enable } = await getSyncStorage<SyncStorage>({ enable: true })
    const [{ mode, customized }] = await getHostMode([urlObj.hostname])
    const coverVisible = await getCoverVisible(id)

    sendMessageToTab<ExtMessageData>(id, {
        type: 'initContent',
        payload: {
            enable: enable,
            mode: mode,
            customized: customized,
            coverVisible: coverVisible,
        }
    })

    console.log('init content', enable, mode, customized)
}


export async function handleOnOff(enable: boolean) {
    const tabs = await queryTabs({})
    tabs.forEach((tab) => {
        sendMessageToTab<ExtMessageData>(tab.id, {
            type: enable ? 'enable' : 'disable'
        })
    })
}

type SetTargetTypeMessage = Extract<MessageData, { type: 'setTargetType' }>

export async function handleTargetType(message: SetTargetTypeMessage) {
    const tabs = await queryTabs({})
    const { customized, host, type, activeTabId } = message.payload
    const isGlobal = !customized && host === '*'

    tabs.forEach((tab) => {
        const url = tab.url || tab.pendingUrl || 'about:blank'
        const hostname = new URL(url).hostname
        const isHost = customized && hostname === host
        if (isHost || isGlobal) {
            sendMessageToTab<MessageData>(tab.id, message)
        }
    })
}

export async function checkContent() {
    const tab = await getActiveTab()
    const response = await sendMessageToTab<ExtMessageData>(tab.id, {
        type: 'hello'
    })

    console.log('checkContent response: ', response)

    if (!response) {
        console.log('executeScript to -> ', tab)
        executeScript({
            files: contentScripts,
            target: {
                tabId: tab.id,
            }
        })
    }
}

type CoverVisibleMessage = Extract<MessageData, { type: 'setCoverVisible' | 'coverVisibleChange' }>
export async function handleCoverVisibleChange(data: CoverVisibleMessage, sender: MessageSender) {
    const tabId = sender.tab?.id
    setCoverVisible(tabId, data.payload.visible)
}

export async function handleSetCoverVisible(data: CoverVisibleMessage, sender: MessageSender) {
    toggleCoverVisible(data.payload.tabId, data.payload.visible)
}

export async function toggleCoverVisible(tabId: number, visible?: boolean) {
    if (typeof visible !== 'boolean') {
        visible = !await getCoverVisible(tabId)
    }

    sendMessageToTab<MessageData>(tabId, {
        type: 'setCoverVisible',
        payload: {
            visible: visible,
            tabId: tabId,
        }
    })

    setCoverVisible(tabId, visible)
}