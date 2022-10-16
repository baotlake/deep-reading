import { ExtMessageData } from "../types";
import { sendMessageToTab } from "../uitls/extension";


export function handleActionClick(tab: chrome.tabs.Tab) {
    console.log('handle action clicked', tab)
    sendMessageToTab<ExtMessageData>(tab.id, {
        type: 'showContentPopup',
        payload: {
            tab: tab,
        }
    })
}