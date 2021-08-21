export function sendMessage(message: any, options?: chrome.runtime.MessageOptions) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, options, resolve)
    })
}

export function sendMessageToTab(tabId: number, message: any) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, message, resolve)
    })
}
