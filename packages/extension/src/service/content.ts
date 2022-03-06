import { getHostMode, getEnable } from "../uitls/setting"
import {
    sendMessageToTab,
    queryTabs,
    getActiveTab,
    executeScript,
} from '../uitls/extension'
import { contentScripts } from '../uitls/config'
import { ExtMessageData } from "../types"

type MessageSender = chrome.runtime.MessageSender
type ContentActiveMessage = Extract<ExtMessageData, { type: 'contentActive' }>
export async function handleContentActive(message: ContentActiveMessage, sender: MessageSender) {
    console.log('handleContentActive', message, sender)
    const { id, url } = sender.tab
    if (!id) return

    const urlObj = new URL(url)
    const enable = await getEnable()
    const [{ mode, customized }] = await getHostMode([urlObj.hostname])

    sendMessageToTab<ExtMessageData>(id, {
        type: 'initContent',
        payload: {
            enable: enable,
            mode: mode,
            customized: customized,
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

type SetTriggerModeMessage = Extract<ExtMessageData, { type: 'setTriggerMode' }>

export async function handleTriggerMode(message: SetTriggerModeMessage) {
    const tabs = await queryTabs({})
    tabs.forEach((tab) => {
        sendMessageToTab<ExtMessageData>(tab.id, message)
    })
}


export async function checkContent() {
    const tab = await getActiveTab()
    const response = await sendMessageToTab<ExtMessageData>(tab.id, {
        type: 'hello'
    })

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