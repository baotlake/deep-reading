import {
    handleReadyStateChange,
    handleMessage,
    handleMouseDown,
    handleMouseUp,
    handleClick,
    touchGesture,
    handleScroll,
    handleBeforeUnload,
    handleClickAnchor,
    handleTouchMove,
    handleContentMessage,
    handleDOMContentLoaded,
    handleLoad,
} from './handler'
import { addContentMessageListener } from './message'
import { insulate } from './parent'
import { setMode } from './mode'

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
    window.addEventListener('click', handleClickAnchor)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('touchmove', handleTouchMove)
    touchGesture.bindListener()
    removeContentListener = addContentMessageListener(handleContentMessage)
    setMode('all')
}

export function remove() {
    window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
    window.removeEventListener('load', handleLoad)
    document.removeEventListener('readystatechange', handleReadyStateChange)
    window.removeEventListener('message', handleMessage)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('click', handleClick, true)
    window.removeEventListener('click', handleClickAnchor)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('touchmove', handleTouchMove)
    touchGesture.removeListener()
    removeContentListener && removeContentListener()
    setMode('disable')
}

