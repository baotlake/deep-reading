import React from 'react'
import { start, remove } from "../content/website"
import { render } from 'react-dom'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { App } from '@wrp/ui'
// import { App } from '../App'
import {
    addContentMessageListener,
    addMessageListener,
    sendMessage,
    sendContentMessage
} from '../content/message'
import { MessageData, MessageType } from '..'

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

    render(
        <CacheProvider value={myCache}>
            <App />
        </CacheProvider>
        ,
        appRoot
    )
}

function forwardContentMessage(data: MessageData) {
    console.log('forwardContentMessage', data)
    switch (data?.type) {
        case MessageType.DOMContentLoaded:
        case MessageType.refusedDisplay:
        case MessageType.summary:
        case MessageType.open:
            sendMessage(data)
            break
    }
}

function forwardMessage(data: MessageData) {
    console.log('forwardMessage', data)
    switch (data?.type) {
        case MessageType.lookUpResult:
        case MessageType.translateResult:
            sendContentMessage(data)
            break
    }
}

addContentMessageListener(forwardContentMessage)
addMessageListener(forwardMessage)
createApp()
start()
