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
} from './handler'
import { insulate } from './parent'

export function start() {
    insulate()
    document.addEventListener('readystatechange', handleReadyStateChange)
    window.addEventListener('message', handleMessage)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('click', handleClick, true)
    window.addEventListener('click', handleClickAnchor)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', handleBeforeUnload)
    touchGesture.bindListener()
}

export function remove() {
    document.removeEventListener('readystatechange', handleReadyStateChange)
    window.removeEventListener('message', handleMessage)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('click', handleClick, true)
    window.removeEventListener('click', handleClickAnchor)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    touchGesture.removeListener()
}


start()
