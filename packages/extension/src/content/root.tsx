import { render, unmountComponentAtNode } from "react-dom"
import { App as CoreApp, CSSGlobal } from '@wrp/inject'
import { ThemeProvider, createTheme } from "@mui/material"
import { themeOptions } from "@wrp/core"

import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { getURL } from "../uitls/extension"


let appRoot: HTMLDivElement

export function createApp() {
    const root = document.createElement('deep-reading')
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
                    </ThemeProvider>
                </CacheProvider>
            </>
            ,
            appRoot,
            resolve,
        )
    })
}

export function unmountApp() {
    appRoot && unmountComponentAtNode(appRoot)
    const root = document.querySelector('#deep-reading-root')
    document.body.parentElement.removeChild(root)
}