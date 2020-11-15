
class Touch {
    constructor() {
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
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

    start(e) {
        this.clear();

        this.startTime = Date.now();
        this.x = e.touches[0].pageX;
        this.y = e.touches[0].clientY;

        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;

        this.target = e.target;

        if (this.onStart)
            this.onStart.call(null, this, e);
    }

    move(e) {
        this.sumX = this.sumX + e.touches[0].pageX - this.x
        this.sumY = this.sumY + e.touches[0].clientY - this.y

        this.x = e.touches[0].pageX;
        this.y = e.touches[0].clientY;

        if (this.onMoving)
            this.onMoving.call(null, this, e);
    }

    end(e) {
        this.duration = Date.now() - this.startTime;
        if (this.onEnd)
            this.onEnd.call(null, this, e);
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