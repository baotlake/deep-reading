import React from 'react'
import { start, remove } from "./content/website"
import { render } from 'react-dom'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
// import { App } from '@wrp/ui'
import { App } from './App'
import {
    // addContentMessageListener,
    // addMessageListener,
    // sendMessage,
    // sendContentMessage,
    MessageData,
    MessageType,
} from '@wrp/core'
import {
    addMessageListener,
    sendMessage,
    sendContentMessage,
    addContentMessageListener,
} from './content/message'
// import { MessageData, MessageType } from '../types'

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
            <App
                alwaysShowAnchor={true}
            />
        </CacheProvider>
        ,
        appRoot
    )
}

function forwardContentMessage(data: MessageData) {
    console.log('content message: ', data)
    switch (data?.type) {
        case 'DOMContentLoaded':
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
