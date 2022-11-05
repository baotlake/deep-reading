import { sendContentMessage } from '../message'
import { proxyFaild, tracePosition } from '../utils'
import { options } from '../options'
import { debounce } from 'lodash-es'
import { Marker } from '@wrp/core'
import { InjectMessage } from '../../type'

const scroll = {
    y: 0,
    x: 0,
}

export function handleMessage(e: MessageEvent<InjectMessage>) {
    const message = e.data
    switch (message.type) {
        case 'restoreScroll':
            const top = message?.payload?.scrollY ?? scroll.y
            const left = message?.payload?.scrollX ?? scroll.x
            console.log('restoreScroll', top, left)
            window.scrollTo(left, top)
            break
        case 'fallbackLoadError':
            proxyFaild(message)
            break
    }
}

export function handleContentMessage(data: InjectMessage) {
    switch (data.type) {
        case 'setTargetType':
            options.targetType = data.payload.type
            break
    }
}

const debouncedReportScroll = debounce(() => {
    sendContentMessage<InjectMessage>({
        type: 'scroll',
        payload: {
            scrollX: scroll.x,
            scrollY: scroll.y,
        },
    })
}, 600)

export function handleScroll(e: Event) {
    const { scrollX, scrollY } = window
    scroll.x = scrollX || scroll.x
    scroll.y = scrollY || scroll.y

    debouncedReportScroll()
}
