import { contentScripts } from '../uitls/config'
import { executeScript, queryTabs } from '../uitls/extension'

type ChangeInfo = chrome.tabs.TabChangeInfo
type Tab = chrome.tabs.Tab

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
