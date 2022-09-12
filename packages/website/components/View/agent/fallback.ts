
import { getProxyUrl } from './proxy'

import type { MessageData } from '@wrp/core'

type LoadErrorMessage = Extract<MessageData, { type: 'loadError' }>

export async function fallbackLoadError(data: LoadErrorMessage) {
    const url = data.payload.url

    try {
        const urlObj = new URL(url)
        // proxy url fail to load.
        if (urlObj.searchParams.get('proxy') === 'fallback') return null
    } catch (err) {
        console.error(err)
        return
    }

    const proxyUrl = getProxyUrl(url, 'tokyo', { proxy: 'fallback' })
    const message: MessageData = {
        type: 'fallbackLoadError',
        payload: {
            ...data.payload,
            proxy: proxyUrl,
        }
    }

    return message
}