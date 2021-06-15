declare module '*.js?raw' {
    const content: string
    export default content
}

declare module '*.module.scss' {
    const content: { [index: string]: string }
    export default content
}
