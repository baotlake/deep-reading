import type { State } from '../reducer'

type Options = State['options']

export type RequestResult<T = any> = {
    headers: Headers | null
    ok: boolean
    redirected: boolean
    status: number
    error: boolean
    url: string
    html: string
    content: {
        text: string
        blob: Blob
    }
    options?: Options
    payload: T
}