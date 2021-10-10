const EVENT_TYPE = 'content_message'
const eventTarget = new EventTarget()

export function sendEventMessage<T>(data: T) {
    const event = new CustomEvent(EVENT_TYPE, {detail: {data}})
    eventTarget.dispatchEvent(event)
}

export function addMessageListener<T>(fn: (data: T) => void) {
    function handle(e: CustomEvent) {
        fn(e.detail)
    }

    eventTarget.addEventListener(EVENT_TYPE, handle as unknown as EventListener)
    return function () {
        eventTarget.removeEventListener(EVENT_TYPE, handle as unknown as EventListener)
    }
}
