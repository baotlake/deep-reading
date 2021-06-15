declare module '*.scss' {
    const content: any
    export default content
}

declare module '*.scss?raw' {
    const content: string
    export default content
}
