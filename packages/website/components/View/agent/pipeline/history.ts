import { ReadHistory } from '@wrp/core'
import type { ResultWithRecap } from './recap'

export const history = new ReadHistory()

export async function pushHistory(result: ResultWithRecap) {

    const { payload } = result
    const pass = /^https?:\/\//.test(result.url)

    console.log('history push: ', pass, payload)

    if (payload && pass && result.ok) {
        const item = await history.push({
            href: result.url,
            title: payload.title,
            icon: payload.favicon,
            description: payload.description,
            createdAt: Date.now(),
            time: 0,
        })

        result.payload.scrollY = item?.scrollY || 0
        result.payload.historyKey = item?.key
    }

    return result
}

export async function updateHistory(key: number, result: ResultWithRecap) {
    const { payload } = result

    await history.update(key, {
        scrollY: payload.scrollY
    })
}