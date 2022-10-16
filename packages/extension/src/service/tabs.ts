import { ExtMessageData } from '../types'
import { contentScripts } from '../uitls/config'
import { createTab, executeScript, queryTabs } from '../uitls/extension'

type ChangeInfo = chrome.tabs.TabChangeInfo
type Tab = chrome.tabs.Tab
type Sender = chrome.runtime.MessageSender

export function handleTabsUpdated(tabId: number, changeInfo: ChangeInfo, tab: Tab) {

}


export async function injectContent() {
    console.log('inject content')
    const tabs = await queryTabs({})
    await Promise.all(tabs.map((tab) => {
        console.log('executeScript ', tab.id)
        return executeScript({
            files: contentScripts,
            target: {
                tabId: tab.id,
            }
        })
    }))
}


type OpenPageMessage = Extract<ExtMessageData, { type: 'openPage' }>
export async function openPage(message: OpenPageMessage, sender: Sender) {
    const { url } = message.payload
    return await createTab({
        url,
        windowId: sender.tab?.windowId,
    })
}