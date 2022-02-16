import { getDomainMode, getEnable } from "../uitls/setting"
import { sendMessageToTab, queryTabs } from '../uitls/extension'
import { ExtMessageData } from "../types"

type MessageSender = chrome.runtime.MessageSender
type ContentActiveMessage = Extract<ExtMessageData, { type: 'contentActive' }>
export async function handleContentActive(message: ContentActiveMessage, sender: MessageSender) {
    console.log('handleContentActive', message, sender)
    const { id, url } = sender.tab
    if (!id) return

    const urlObj = new URL(url)
    const enable = await getEnable()
    const { mode, own } = await getDomainMode(urlObj.hostname)

    sendMessageToTab<ExtMessageData>(id, {
        type: 'initContent',
        payload: {
            enable: enable,
            mode: mode,
            own: own,
        }
    })

    console.log('init content', enable, mode, own)
}


export async function handleOnOff(enable: boolean) {
    const tabs = await queryTabs({})
    tabs.forEach((tab) => {
        sendMessageToTab<ExtMessageData>(tab.id, {
            type: enable ? 'enable' : 'disable'
        })
    })
}