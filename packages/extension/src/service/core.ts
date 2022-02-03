import { Dictionary, MessageData, MessageType, Translator } from "@wrp/core"
import { sendMessageToTab } from "../uitls/extension"


type LookUpMessageData = Extract<MessageData, { type: MessageType.lookUp }>
type MessageSender = chrome.runtime.MessageSender

export async function lookUp(data: LookUpMessageData, sender: MessageSender) {
    const dictionary = new Dictionary()
    const result = await dictionary.search(data.text)

    const tabId = sender.tab?.id
    tabId && sendMessageToTab(tabId, {
        type: MessageType.lookUpResult,
        data: result,
    })

    console.log('sendMessageToTab', result)

}


type TranslateMessageData = Extract<MessageData, { type: MessageType.translate }>
export async function translate(data: TranslateMessageData, sender: MessageSender) {
    const translator = new Translator()
    const result = await translator.translate(data.text)
    const tabId = sender.tab?.id

    tabId && sendMessageToTab(tabId, {
        type: MessageType.translateResult,
        data: result,
    })

    console.log('sendMessageToTab', result)
}