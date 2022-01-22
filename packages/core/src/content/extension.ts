import {
    handleMouseDown,
    handleMouseUp,
    handleClick,
    touchGesture,
    handleScroll,
} from './handler'

export function start() {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('click', handleClick, true)
    window.addEventListener('scroll', handleScroll)
    touchGesture.bindListener()
}

export function remove() {
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('click', handleClick, true)
    window.removeEventListener('scroll', handleScroll)
    touchGesture.removeListener()
}
