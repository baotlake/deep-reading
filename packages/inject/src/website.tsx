import React from 'react'
import { start, remove } from "./content/website"
import { render } from 'react-dom'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { createTheme, ThemeProvider } from "@mui/material"
import { App } from './App'
import { themeOptions } from '@wrp/core'
import type {
    MessageData,
    MessageType,
} from '@wrp/core'
import {
    addMessageListener,
    sendMessage,
    sendContentMessage,
    addContentMessageListener,
} from './content/message'

console.log('injection website.tsx')

function createApp() {
    const root = document.createElement('deep-reading')
    root.id = 'deep-reading-root'
    document.children[0].appendChild(root)

    const shadowRoot = root.attachShadow({ mode: "open" })

    const appRoot = document.createElement('div')
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

    render(
        <CacheProvider value={myCache}>
            <ThemeProvider theme={theme}>
                <App
                    alwaysShowAnchor={true}
                />
            </ThemeProvider>
        </CacheProvider>
        ,
        appRoot
    )
}

function forwardContentMessage(data: MessageData) {
    console.log('content message: ', data)
    switch (data?.type) {
        case 'readyStateChange':
        case 'DOMContentLoaded':
        case 'load':
        case 'refusedDisplay':
        case 'summary':
            // case 'open':
            sendMessage(data)
            console.log('forward content message: ', data)
            break
    }
}

function forwardMessage(data: MessageData) {
    console.log('message: ', data)
    switch (data?.type) {
        case 'lookUpResult':
        case 'translateResult':
            sendContentMessage(data)
            console.log('forward message to content: ', data)
            break
    }
}

addContentMessageListener(forwardContentMessage)
addMessageListener(forwardMessage)
createApp()
start()
