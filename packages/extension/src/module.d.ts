
declare module '*.js?raw' {
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

declare module '*.css?raw' {
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

declare const __webpack_public_path__: string

declare const __DEV__: boolean
