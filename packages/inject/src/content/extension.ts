import {
    handleClick,
    handlePointerDown,
    handlePointerUp,
    handleScroll,
    handleContentMessage,
    handleTouchEnd,
} from './handler'

import { addContentMessageListener } from './message'
import { options } from './options'


let registered = false
let removeContentListener: () => void

export function start() {
    if (registered) return
    registered = true
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('click', handleClick, true)
    window.addEventListener('scroll', handleScroll)
    removeContentListener = addContentMessageListener(handleContentMessage)
    options.preventClickLink = false
}

export function remove() {
    registered = false
    window.removeEventListener('pointerdown', handlePointerDown)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('click', handleClick, true)
    window.removeEventListener('scroll', handleScroll)
    removeContentListener && removeContentListener()
    options.preventClickLink = false
}
