import { getTargetByPoint, extractWordRange } from '@wrp/core'

let impedeUnloadEvent = false

enum Gesture {
    tap,
    singleTap,
    doubleTap,
    tripleTap,
    swipe,
    scroll,
}

enum Action {
    getWordRange,
    getSentenceRange,
    getWordBoundingRect,
    getSentenceBoundingRect,
}

const gestureAction: { [index: number]: Action } = {
    [Gesture.tap]: Action.getWordRange,
}

interface ActionData {
    wordRange?: Range
    sentenceRange?: Range
}

const actionData: ActionData = {}

interface Options {
    autoSelectWord?: boolean
    autoSelectSentence?: boolean
}

const options: Options = {
    autoSelectWord: false,
    autoSelectSentence: true,
}

function getWordRange(x: number, y: number) {
    let target = getTargetByPoint(x, y)
    if (target === false) return
    actionData.wordRange = extractWordRange(target[0], target[1])
}

window.addEventListener('click', (e) => {
    impedeUnloadEvent = true
    setTimeout(() => (impedeUnloadEvent = false), 300)

    clickAnchor(e)

    let [x, y] = [e.clientX, e.clientY]
    let target = getTargetByPoint(x, y)

    if (target === false) return

    let selection = getSelection()

    let wordRange = extractWordRange(target[0], target[1])
    console.log(`%c${wordRange.toString()}`, 'color: red;')

    selection?.removeAllRanges()
    selection?.addRange(wordRange)
})

window.addEventListener('scroll', (e) => {
    // console.log('scroll: ', e)
})

window.addEventListener('beforeunload', (e) => {
    if (!impedeUnloadEvent) return

    e.preventDefault()
    e.returnValue = false
})

function clickAnchor(e: MouseEvent) {
    let target = e.target as Element

    while (target.nodeName !== 'BODY') {
        if (target.nodeName === 'A') {
            break
        }

        if (target.parentElement) {
            target = target.parentElement
        }
    }

    if (target.nodeName === 'A') {
        let href = target.getAttribute('href') || ''

        if (/^(mailto:)|(tel:)/.test(href)) return

        e.preventDefault()
        e.stopPropagation()

        if (/^#/) {
            window.location.hash = href
            return
        }

        console.log('click anchor: ', href)
    }
}

window.addEventListener('message', (e) => {
    console.log('message', e)

    switch (e.data.type) {
        case '':
    }
})
