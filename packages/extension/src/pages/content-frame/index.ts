import { MessageData, MessageType } from '@wrp/core';
import { addMessageListener, getCurrentTab } from '../../uitls/extension'


const data = {
    tabId: -1,
}


getCurrentTab().then((tab) => {
    data.tabId = tab.id
})

type PlayPronunciationMessageData = Extract<MessageData, { type: 'playPronunciation' }>

function playPronunciation(message: PlayPronunciationMessageData) {
    const audio = new Audio(message.data.url)
    audio.play()
}

function handleMessage(message: MessageData, sender: chrome.runtime.MessageSender) {
    const senderTabId = sender.tab.id
    const { tabId } = data
    switch (message.type) {
        case 'playPronunciation':
            senderTabId === tabId && playPronunciation(message)
            break
    }
}

addMessageListener(handleMessage)