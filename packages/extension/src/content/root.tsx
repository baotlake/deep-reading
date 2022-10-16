import { render, unmountComponentAtNode } from "react-dom"
import { CSSGlobal } from '@wrp/inject'
import { TargetType, MessageData } from "@wrp/core"
import { App } from './App'
import { ExtMessageData } from '../types/message'
import {
    start,
    remove,
    sendContentMessage,
} from '@wrp/inject'

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"


let root: HTMLElement = null
let appRoot: HTMLDivElement = null

function mountApp() {
    if (root && appRoot) return

    root = document.createElement('deep-reading')
    root.id = 'deep-reading-root'
    document.children[0].appendChild(root)

    const shadowRoot = root.attachShadow({ mode: "open" })

    appRoot = document.createElement('div')
    appRoot.id = 'app-root'
    const otherRoot = document.createElement('div')
    otherRoot.id = 'other-root'

    shadowRoot.appendChild(otherRoot)
    shadowRoot.appendChild(appRoot)

    const myCache = createCache({
        key: 'deep-reading',
        stylisPlugins: [],
        container: otherRoot,
    })

    return new Promise<void>((resolve) => {
        render(
            <>
                <CSSGlobal />
                <CacheProvider value={myCache}>
                    <App />
                </CacheProvider>
            </>
            ,
            appRoot,
            resolve,
        )
    })
}

function unmountApp() {
    appRoot && unmountComponentAtNode(appRoot)
    root && root.parentElement.removeChild(root)
    appRoot = null
    root = null
}


const contentData = {
    enable: false,
    hostname: '',
    customizedMode: false,
    targetType: 'none' as TargetType,
}

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>
export async function init(data: InitContentMessage) {
    const { enable, mode, customized, coverVisible } = data.payload
    // contentData.enable = enable
    contentData.hostname = new URL(location.href).hostname
    contentData.customizedMode = customized
    contentData.targetType = mode

    // if (!enable) return

    if (enable) start()
    await mountApp()

    sendContentMessage<MessageData>({
        type: 'setTargetType',
        payload: {
            type: mode,
            host: contentData.hostname,
            customized: customized,
        }
    })

    if (enable && coverVisible) {
        sendContentMessage<MessageData>({
            type: 'setCoverVisible',
            payload: {
                visible: coverVisible,
            }
        })
    }
}

export async function enable() {
    if (contentData.enable) return
    contentData.enable = true

    start()
    await mountApp()
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

export function disable() {
    if (contentData.enable === false) return
    contentData.enable = false

    remove()
    unmountApp()
}

type ShowContentPopupMessage = Extract<ExtMessageData, { type: 'showContentPopup' }>
export async function showContentPopup(data: ShowContentPopupMessage) {
    await mountApp()
    sendContentMessage(data)
}