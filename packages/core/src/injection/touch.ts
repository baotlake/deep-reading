interface TouchData {
    target: Element
    nativeEvent: Event
    startTime: number
    sumX: number
    sumY: number
    startX: number
    startY: number
    x: number
    y: number
    duration: number
}

interface TouchOptions {
    onStart?: (data?: TouchData) => void
    onMove?: (data?: TouchData) => void
    onEnd?: (data?: TouchData) => void
}

export class Touch {
    protected data: TouchData

    public onStart: (data?: TouchData) => void
    public onMove: (data?: TouchData) => void
    public onEnd: (data?: TouchData) => void

    constructor(options?: TouchOptions) {
        if (options?.onStart) this.onStart = options.onStart
        if (options?.onMove) this.onMove = options.onMove
        if (options?.onEnd) this.onEnd = options.onEnd

        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
    }

    public bindListener() {
        window.addEventListener('touchstart', this.handleTouchStart, {
            passive: true,
        })
        window.addEventListener('touchmove', this.handleTouchMove, {
            passive: true,
        })
        window.addEventListener('touchend', this.handleTouchEnd, {
            passive: true,
        })
    }

    public removeListener() {
        window.removeEventListener('touchstart', this.handleTouchStart)
        window.removeEventListener('touchmove', this.handleTouchMove)
        window.removeEventListener('touchend', this.handleTouchEnd)
    }

    protected handleTouchStart(e: TouchEvent) {
        this.data = {
            target: e.target as Element,
            nativeEvent: e,
            startTime: Date.now(),
            sumX: 0,
            sumY: 0,
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY,
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            duration: 0,
        }
        if (typeof this.onStart === 'function') this.onStart(this.data)
    }

    protected handleTouchMove(e: TouchEvent) {
        this.data.sumX += e.touches[0].clientX - this.data.x
        this.data.sumY += e.touches[0].clientY - this.data.y
        this.data.duration = Date.now() - this.data.startTime
        this.data.x = e.touches[0].clientX
        this.data.y = e.touches[0].clientY
        this.data.nativeEvent = e

        if (typeof this.onMove === 'function') this.onMove(this.data)
    }

    protected handleTouchEnd(e: TouchEvent) {
        this.data.nativeEvent = e
        this.data.duration = Date.now() - this.data.startTime

        if (typeof this.onEnd === 'function') this.onEnd(this.data)
    }
}

interface TouchGestureOptions extends TouchOptions {
    onSlip?: (data: TouchData) => void
}

export class TouchGesture extends Touch {
    public onSlip: (data?: TouchData) => void
    

    constructor(options?: TouchGestureOptions) {
        super(options)
        if (options?.onSlip) this.onSlip = options.onSlip

        this.handleTouchEnd = this.handleTouchEnd.bind(this)
    }

    protected handleTouchEnd(e: TouchEvent) {
        super.handleTouchEnd(e)

        this.slip()
    }

    private slip() {
        if (Math.abs(this.data.sumX) > 25 && Math.abs(this.data.sumY) < 12) {
            if (typeof this.onSlip === 'function') {
                this.onSlip(this.data)
            }
        }
    }
}
