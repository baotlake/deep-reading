

/**
 * 记录TouchMove 的 dx, dy偏移值和 duration 持续时间, 
 * 并在恰当时机触发回调
 * 不阻止默认事件 passive: false
 */
class Touch {
    constructor(options) {
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
        if (!options) return;
        if (options.onEnd) this.setOnEnd(options.onEnd);
        if (options.onMoving) this.setOnMoving(options.onMoving);
        if (options.onStart) this.setOnStart(options.onStart);
    }

    clear() {
        this.target = null;
        this.sumX = 0;
        this.sumY = 0;
        this.startX = 0;
        this.startY = 0;
        this.x = 0;
        this.y = 0;
        this.startTime = 0;
        this.duration = 0;
    }

    getCoordinate(e) {
        return {
            pageX: e.touches[0].pageX,
            pageY: e.touches[0].pageY,
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
        }
    }

    start(e, data) {
        this.clear();

        this.startTime = Date.now();
        this.x = this.getCoordinate(e).pageX
        this.y = this.getCoordinate(e).clientY;

        this.startX = this.getCoordinate(e).clientX;
        this.startY = this.getCoordinate(e).clientY;

        this.target = e.target;

        if (this.onStart)
            this.onStart.call(null, this, e);
        if (data)
            this.data = data;
    }

    move(e) {
        this.sumX = this.sumX + this.getCoordinate(e).pageX - this.x
        this.sumY = this.sumY + this.getCoordinate(e).clientY - this.y

        this.x = this.getCoordinate(e).pageX;
        this.y = this.getCoordinate(e).clientY;

        if (this.onMoving)
            this.onMoving.call(null, this, e);
    }

    end(e) {
        this.duration = Date.now() - this.startTime;
        if (this.onEnd)
            return this.onEnd.call(null, this, e);
    }

    setOnEnd(callback) {
        if (typeof callback === 'function')
            this.onEnd = callback;
    }

    setOnMoving(callback) {
        if (typeof callback === 'function')
            this.onMoving = callback;
    }

    setOnStart(callback) {
        if (typeof callback === 'function')
            this.onStart = callback;
    }
}

export default Touch;

/**
 * 同一位置连续点击多次
 */
export class Tap {
    constructor(options) {
        this.tapList = [];
        this.count = 0;

        this.effectiveInterval = options.interval || 350;
        this.effectiveOffset = options.offset || 20;
        this.effectiveCount = options.count || 3;
        if (typeof options.callback === 'function') {
            this.callback = options.callback
        } else {
            this.callback = (() => { })
        }

    }

    tap(e) {
        this.tapList.unshift(
            {
                x: e.clientX,
                y: e.clientY,
                timeStamp: e.timeStamp,
            }
        )
        this.tapList = this.tapList.slice(0, 3);

        this.repeatedDetect()
    }

    repeatedDetect() {
        if (this.tapList.length < 2) return;
        if ((this.tapList[0].timeStamp - this.tapList[1].timeStamp) > this.effectiveInterval) {
            return this.count = 0;
        }

        if (
            Math.abs(this.tapList[0].x - this.tapList[1].x) <= this.effectiveOffset &&
            Math.abs(this.tapList[0].y - this.tapList[1].y) <= this.effectiveOffset
        ) {
            this.count = this.count + 1;

            if (this.count === this.effectiveCount - 1) {
                return this.callback.call(null, this.count);
            }
        } else {
            return this.count = 0;
        }
    }

}

export class MouseMove extends Touch {
    constructor(options) {
        super(options)
        this.button = options.button
        this.moving = false
    }

    getCoordinate(e) {
        return {
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
        }
    }

    start(e, data) {
        if (this.button.includes(e.button)) {
            super.start(e, data)
            this.moving = true
        }

    }

    move(e) {
        if (this.moving) {
            super.move(e)
        }
    }

    end(e) {
        this.moving = false
        if (this.button.includes(e.button)) {
            return super.end(e)
        }
    }

}

export class TouchOrMouse extends MouseMove {
    getCoordinate(e) {
        if (e.touches) {
            return {
                pageX: e.touches[0].pageX,
                pageY: e.touches[0].pageY,
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY,
            }
        }
        return {
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
        }
    }

}