import { render } from "react-dom";
// import { App as CoreApp } from '@wrp/ui'
import { App as CoreApp } from '@wrp/core/es/App'
import App from "./App";


import createCache from "@emotion/cache";
import { CacheProvider, jsx, css } from "@emotion/react";
import { getURL } from "../uitls/extension";


export function createApp() {
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

    const contentFrameUrl = getURL('/content-frame.html')

    render(
        <CacheProvider value={myCache}>
            <CoreApp invisibleFrameSrc={contentFrameUrl} />
            {/* <App /> */}
        </CacheProvider>
        ,
        appRoot
    )
}