import {
    handleReadyStateChange,
    handleMessage,
    handleMouseDown,
    handleMouseUp,
    handleClick,
    touchGesture,
    handleScroll,
    handleBeforeUnload,
    handleTouchMove,
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
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('click', handleClick, true)
    // window.addEventListener('click', handleClickAnchor)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('error', handleError, true)
    touchGesture.bindListener()
    removeContentListener = addContentMessageListener(handleContentMessage)
    options.triggerMode = 'all'
    options.preventClickLink = true
}

export function remove() {
    window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
    window.removeEventListener('load', handleLoad)
    document.removeEventListener('readystatechange', handleReadyStateChange)
    window.removeEventListener('message', handleMessage)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('click', handleClick, true)
    // window.removeEventListener('click', handleClickAnchor)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('error', handleError, true)
    touchGesture.removeListener()
    removeContentListener && removeContentListener()
    options.triggerMode = 'disable'
    options.preventClickLink = false
}

