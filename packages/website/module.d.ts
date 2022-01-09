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

declare  module '*.png' {
    const content: any
    export default content
}
