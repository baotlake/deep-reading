import { Dictionary, MessageData, MessageType, Translator, eventCollect } from "@wrp/core"
import { sendMessageToTab } from "../uitls/extension"


type LookUpMessageData = Extract<MessageData, { type: 'lookUp' }>
type MessageSender = chrome.runtime.MessageSender

export async function lookUp(data: LookUpMessageData, sender: MessageSender) {
    const dictionary = new Dictionary()
    const result = await dictionary.search(data.text)

    const tabId = sender.tab?.id
    tabId && sendMessageToTab(tabId, {
        type: 'lookUpResult',
        data: result,
    })

    console.log('sendMessageToTab', result)

    eventCollect({
        ec: 'extension',
        ea: "lookup",
        // el: data.,
        ev: 1,
    })
}


type TranslateMessageData = Extract<MessageData, { type: 'translate' }>
export async function translate(data: TranslateMessageData, sender: MessageSender) {
    const translator = new Translator()
    const result = await translator.translate(data.text)
    const tabId = sender.tab?.id

    tabId && sendMessageToTab(tabId, {
        type: 'translateResult',
        data: result,
    })

    console.log('sendMessageToTab', result)
}