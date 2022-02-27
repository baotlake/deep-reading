

export type RequestResult<T = any> = {
    headers: Headers
    ok: boolean
    redirected: boolean
    status: number
    url: string
    html: string
    content: {
        text: string
        blob: Blob
    }
    payload: T
}