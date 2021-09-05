export function sendMessage<T>(message: T, options?: chrome.runtime.MessageOptions) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, options || {}, resolve)
    })
}

export function sendMessageToTab<T>(tabId: number, message: T) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, message, resolve)
    })
}
