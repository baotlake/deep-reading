import Mark from 'mark.js'
import { markRange } from './utils'

type Mark = typeof Mark

class Marker {

    private readonly preffix: string

    private highlightMark: Mark
    private highlightId: number

    private delayTimeoutId: number


    constructor(preffix: string) {
        this.preffix = preffix

        this.highlightMark = null
        this.highlightId = 0

        this.delayTimeoutId = -1
    }

    public highlight(range: Range) {
        const [mark, id] = [this.highlightMark, this.highlightId]
        this.highlightId = Date.now() % 10000
        this.highlightMark = markRange(range, { className: this.preffix + this.highlightId })

        setTimeout(() => {
            this.unmark(mark, id)
        }, 300)
    }

    public delayUnmark(duration = 300) {
        const [mark, id] = [this.highlightMark, this.highlightId]
        this.delayTimeoutId = window.setTimeout(() => {
            this.unmark(mark, id)
        }, duration)
    }

    public cancelDelay() {
        clearTimeout(this.delayTimeoutId)
    }

    private unmark(mark: Mark, id: number) {
        if (!mark) return
        mark.unmark({ className: this.preffix + id })
    }
}

export {
    Marker
}