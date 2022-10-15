import { render, unmountComponentAtNode } from "react-dom"
import { App as CoreApp, CSSGlobal } from '@wrp/inject'
import { ThemeProvider, createTheme } from "@mui/material"
import { themeOptions, TargetType, MessageData } from "@wrp/core"
import { getURL } from "../uitls/extension"
import { App } from './App'
import { ExtMessageData } from '../types/message'
import {
    start,
    remove,
    sendContentMessage,
} from '@wrp/inject'

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"


let root: HTMLElement
let appRoot: HTMLDivElement

const contentData = {
    enable: false,
    hostname: '',
    customizedMode: false,
    targetType: 'none' as TargetType,
}

function createApp() {
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

    const theme = createTheme(themeOptions)

    const contentFrameUrl = getURL('/content-frame.html')

    return new Promise<void>((resolve) => {
        render(
            <>
                <CSSGlobal />
                <CacheProvider value={myCache}>
                    <ThemeProvider theme={theme}>
                        <CoreApp invisibleFrameSrc={contentFrameUrl} />
                        <App />
                    </ThemeProvider>
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
}

type InitContentMessage = Extract<ExtMessageData, { type: 'initContent' }>
export async function init(data: InitContentMessage) {
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

export function enable() {
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

export function disable() {
    if (contentData.enable === false) return
    contentData.enable = false

    remove()
    unmountApp()
}