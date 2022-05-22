declare module '*.js?raw' {
    const content: string
    export default content
}

declare module '*.ts?raw' {
    const content: string
    export default content
}

declare module '*.module.scss' {
    const content: { [index: string]: string }
    export default content
}

declare module '*.scss?raw' {
    const content: string
    export default content
}

declare module '*.png' {
    const content: any
    export default content
}

declare module '*.svg?svgr' {
    import React from "react"
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
    export default SVG
}


declare interface TawkApi {
    showWidget: () => void
    hideWidget: () => void
    toggleVisibility: () => void
    maximize: () => void
    minimize: () => void
    toggle: () => void

    onLoad: null | (() => void)
}

declare interface TidioChatApi {
    hide: () => void
    show: () => void
    open: () => void
    close: () => void
}

declare type Gtag = (
    type: string,
    name: string,
    data?: any,
) => void

interface Window {
    gtag?: Gtag
    Tawk_API?: TawkApi
    tidioChatApi?: TidioChatApi
}


interface ProcessEnv {
    LOOKUP_API: string
    TRANSLATE_API: string
    SHANGHAI_PROXY_API: string
    TOKYO_PROXY_API: string
    VIEW_SRC: string
    CONTENTFUL_SPACE_ID: string
    CONTENTFUL_CDA_TOKEN: string
    CONTENTFUL_ENV_ID: string
}
