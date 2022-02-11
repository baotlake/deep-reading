import { Dictionary, MessageData, MessageType, Translator } from '@wrp/core'
import { sendMessage, sendMessageToTab } from '../../uitls/extension'

console.log('background.js')

const dictionary = new Dictionary()
const translator = new Translator()

let tabId = 0

function search(word: string) {
    dictionary.search(word).then((data) => {
        sendMessageToTab(tabId, {
            type: 'lookUpResult',
            data: data,
        })
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
        case 'lookUp':
            search(data.text)
            break
        case 'translate':
            translator.translate(data.text).then((value) => {
                sendMessageToTab(tabId, {
                    type: 'translateResult',
                    data: value
                })
            })
            break
        case 'playPronunciation':
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
