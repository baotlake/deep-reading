import {LookUp, MessageData, MessageType, Translate} from '@wrp/core'
import {sendMessage, sendMessageToTab} from '../uitls/extension'

console.log('background.js')

const lookUp = new LookUp()
const translate = new Translate()

let tabId = 0

lookUp.onExplain = (data) => {
    console.log('onExplain', data, tabId)
    sendMessageToTab(tabId, {
        type: MessageType.lookUpResult,
        data: data,
    })
}

translate.onTranslate = (data) => {
    console.log('onTranslate', data, tabId)
    sendMessageToTab(tabId, {
        type: MessageType.translateResult,
        data: data
    })
}

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // do some thing
    }
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    const data: MessageData = {...message}
    console.log('background onMessage', data.type, message, sender)
    if (sender.tab) {
        tabId = sender.tab.id as number
    }
    switch (data.type) {
        case MessageType.lookUp:
            lookUp.lookUp(data.text)
            break
        case MessageType.translate:
            translate.translate(data.text)
            break
    }

})

chrome.runtime.onConnect.addListener((port) => {
    console.log('background onConnect ', port)
})

export {}
