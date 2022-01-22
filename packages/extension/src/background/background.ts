import { Dictionary, MessageData, MessageType, Translator } from '@wrp/core'
import { sendMessage, sendMessageToTab } from '../uitls/extension'

console.log('background.js')

const dictionary = new Dictionary()
const translator = new Translator()

let tabId = 0

function search(word: string) {
    dictionary.search(word).then((data) => {
        sendMessageToTab(tabId, {
            type: MessageType.lookUpResult,
            data: data,
        })
    })
}

// dictionary.onExplain = (data) => {
//     console.log('onExplain', data, tabId)
//     sendMessageToTab(tabId, {
//         type: MessageType.lookUpResult,
//         data: data,
//     })
// }

translator.onTranslate = (data: any) => {
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
    const data: MessageData = { ...message }
    console.log('background onMessage', data.type, message, sender)
    if (sender.tab) {
        tabId = sender.tab.id as number
    }
    switch (data.type) {
        case MessageType.lookUp:
            search(data.text)
            break
        case MessageType.translate:
            translator.translate(data.text)
            break
        case MessageType.playPronunciation:
            playPronunciation(data.data)
            break
    }

})

let audio: HTMLAudioElement
function playPronunciation(data: any) {
    if (!audio) {
        audio = document.createElement('audio')
    }
    audio.src = data.url
    audio.play()
}

chrome.runtime.onConnect.addListener((port) => {
    console.log('background onConnect ', port)
})

export { }
