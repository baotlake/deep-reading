import {
    handleReadyStateChange,
    handleMessage,
    handleClick,
    handlePointerDown,
    handlePointerUp,
    handleTouchEnd,
    handleScroll,
    handleContentMessage,
    handleDOMContentLoaded,
    handleLoad,
    handleError,
} from './handler'
import { addContentMessageListener } from './message'
import { insulate } from './parent'
import { options } from './options'

let removeContentListener: () => void

export function start() {
    insulate()
    window.addEventListener('DOMContentLoaded', handleDOMContentLoaded)
    window.addEventListener('load', handleLoad)
    document.addEventListener('readystatechange', handleReadyStateChange)
    window.addEventListener('message', handleMessage)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('click', handleClick, true)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('error', handleError, true)
    removeContentListener = addContentMessageListener(handleContentMessage)
    options.targetType = 'all'
    options.preventClickLink = true
}

export function remove() {
    window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
    window.removeEventListener('load', handleLoad)
    document.removeEventListener('readystatechange', handleReadyStateChange)
    window.removeEventListener('message', handleMessage)
    window.removeEventListener('pointerdown', handlePointerDown)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('click', handleClick, true)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('error', handleError, true)
    removeContentListener && removeContentListener()
    options.targetType = 'none'
    options.preventClickLink = false
}

