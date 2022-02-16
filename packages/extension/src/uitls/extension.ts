
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

type Sender = chrome.runtime.MessageSender
export function addMessageListener<T>(fn: (data: T, sender: Sender) => void) {
    chrome.runtime.onMessage.addListener(fn)
    return () => chrome.runtime.onMessage.removeListener(fn)
}

export function getCurrentTab() {
    return new Promise<chrome.tabs.Tab>((resolve) => {
        chrome.tabs.getCurrent(resolve)
    })
}

export function getActiveTab() {
    return new Promise<chrome.tabs.Tab>((resolve) => {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, (tabs) => resolve(tabs.length > 0 ? tabs[0] : null))
    })
}

type QueryInfo = chrome.tabs.QueryInfo
export function queryTabs(query: QueryInfo) {
    return new Promise<chrome.tabs.Tab[]>((resolve) => {
        chrome.tabs.query(query, resolve)
    })
}

export function getURL(path: string) {
    return chrome.runtime.getURL(path)
}

export function getSyncStorage<T, Key = string | string[] | Record<string, T>>(keys: Key) {
    return new Promise<Record<string, T>>((resolve) => {
        chrome.storage.sync.get(keys, resolve)
    })
}

export function setSyncStorage<T>(items: T) {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.set(items, resolve)
    })
}

