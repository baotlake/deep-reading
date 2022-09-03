import {
    handleMouseDown,
    handleMouseUp,
    handleClick,
    touchGesture,
    handleScroll,
    handleContentMessage,
} from './handler'

import { addContentMessageListener } from './message'
import { options } from './options'


let removeContentListener: () => void

export function start() {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('click', handleClick, true)
    window.addEventListener('scroll', handleScroll)
    touchGesture.bindListener()
    removeContentListener = addContentMessageListener(handleContentMessage)
    options.preventClickLink = false
}

export function remove() {
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('click', handleClick, true)
    window.removeEventListener('scroll', handleScroll)
    touchGesture.removeListener()
    removeContentListener && removeContentListener()
    options.preventClickLink = false
}
