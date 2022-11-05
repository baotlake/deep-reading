import { getCoparentElement } from "./dom"
import Mark from 'mark.js'

export function markRange(range: Range, options?: any) {
    const startNode = range.startContainer
    const endNode = range.endContainer
    const coparent = getCoparentElement(startNode, endNode, ['MARK'])
    if (!coparent) return null

    const newRange = range.cloneRange()
    newRange.setStart(coparent, 0)
    newRange.setEnd(startNode, range.startOffset)
    const startOffset = newRange.toString().length
    newRange.detach()

    const length = range.toString().length

    const marker = new Mark(coparent as HTMLElement)
    marker.markRanges(
        [
            {
                start: startOffset,
                length: length,
            },
        ],
        options
    )

    return marker
}

export class Marker {

    private readonly preffix: string
    private readonly delay: number

    private highlightMark: Mark | null
    private highlightId: number

    private delayTimeoutId: number


    constructor(preffix: string, delay = 60) {
        this.preffix = preffix
        this.delay = delay

        this.highlightMark = null
        this.highlightId = 0

        this.delayTimeoutId = -1
    }

    public highlight(range: Range) {
        const [mark, id] = [this.highlightMark, this.highlightId]
        this.highlightId = Date.now() % 10000
        this.highlightMark = markRange(range, { className: this.preffix + this.highlightId })

        setTimeout(() => {
            if (mark) this.unmark(mark, id)
        }, this.delay)
    }

    public delayUnmark() {
        const [mark, id] = [this.highlightMark, this.highlightId]
        this.delayTimeoutId = window.setTimeout(() => {
            if (mark) this.unmark(mark, id)
        }, this.delay)
    }

    public cancelDelay() {
        clearTimeout(this.delayTimeoutId)
    }

    private unmark(mark: Mark, id: number) {
        if (!mark) return
        mark.unmark({ className: this.preffix + id })
    }
}
