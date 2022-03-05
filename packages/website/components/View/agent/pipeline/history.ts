import { ReadHistory } from '@wrp/core'
import type { ResultWithRecap } from './recap'


const data = {
    history: null as null | ReadHistory
}

export function add(result: ResultWithRecap) {

    if (!data.history) data.history = new ReadHistory()
    const { payload } = result
    const pass = /^https?:\/\//.test(result.url)

    console.log('history add: ', pass, payload)

    if (payload && pass && data.history) {
        data.history.push({
            href: result.url,
            title: payload.title,
            icon: payload.favicon,
            description: payload.description,
            createdAt: Date.now(),
            time: 0,
        })
    }

    return result
}