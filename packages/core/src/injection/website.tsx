import React from 'react'
import { start, remove } from "../content/website"
import { render } from 'react-dom'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import App from '../App'

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

createApp()
start()
