
import {
    MessageData,
    TargetType,
} from '@wrp/core'
import {
    start,
    remove,
    sendContentMessage,
    addContentMessageListener,
} from '@wrp/inject'

import { ExtMessageData, ExtMessageType } from '../types/message'
import { createApp, unmountApp } from './root'
import { addMessageListener, sendMessage } from '../uitls/extension'


const contentData = {
    enable: false,
    hostname: '',
    customizedMode: false,
    targetType: 'none' as TargetType,
}

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>
async function init(data: InitContentMessage) {
    const { enable, mode, customized, coverVisible } = data.payload
    // contentData.enable = enable
    contentData.hostname = new URL(location.href).hostname
    contentData.customizedMode = customized
    contentData.targetType = mode

    if (!enable) return

    start()
    await createApp()

    sendContentMessage<MessageData>({
        type: 'setTargetType',
        payload: {
            type: mode,
            host: contentData.hostname,
            customized: customized,
        }
    })

    if (coverVisible) {
        sendContentMessage<MessageData>({
            type: 'setCoverVisible',
            payload: {
                visible: coverVisible,
            }
        })
    }
}

type SetTriggerModeMessage = Extract<MessageData, { type: 'setTargetType' }>
function setTriggerMode(data: SetTriggerModeMessage) {
    const { customized, host, type, activeTabId } = data.payload
    if (typeof customized === 'boolean') {
        contentData.customizedMode = customized
    }
    const { hostname, customizedMode } = contentData
    const isHost = customizedMode && hostname === host
    const isGlobal = !customizedMode && host === '*'

    if (isHost || isGlobal) {
        sendContentMessage(data)
        contentData.targetType = type
    }
}

function enable() {
    if (contentData.enable) return
    contentData.enable = true

    start()
    createApp()
    const { customizedMode, targetType, hostname } = contentData
    sendContentMessage<MessageData>({
        type: 'setTargetType',
        payload: {
            type: targetType,
            host: hostname,
            customized: customizedMode,
        }
    })
}

function disable() {
    if (contentData.enable === false) return
    contentData.enable = false

    remove()
    unmountApp()
}

type Message = MessageData | ExtMessageData
type Sender = chrome.runtime.MessageSender
type SendResponse = (response: boolean) => void
function hanldeExtMessage(data: Message, sender: Sender, sendResponse: SendResponse) {
    sendResponse(true)

    console.warn(data, sender)
    switch (data.type) {
        case 'initContent':
            init(data)
            break
        case 'translateResult':
        case 'lookUpResult':
        case 'setCoverVisible':
            sendContentMessage(data)
            break
        // broadcast message
        case 'setTargetType':
            setTriggerMode(data)
            break
        case 'enable':
            enable()
            break
        case 'disable':
            disable()
            break
    }
}

function handleContentMessage(data: MessageData) {
    switch (data.type) {
        default:
            break
    }
}

function main() {
    console.log('❤ content main', globalThis.CONTENT_INITED)
    if (globalThis.CONTENT_INITED === true) return
    globalThis.CONTENT_INITED = true
    addMessageListener(hanldeExtMessage)
    addContentMessageListener<MessageData>(handleContentMessage)

    sendMessage<ExtMessageData>({
        type: 'contentActive',
    })
}

main()
