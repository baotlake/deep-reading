

const real = {
    replaceState: null as null | History['replaceState'],
}

export function polyfillHistory() {
    real.replaceState = globalThis.history.replaceState
    globalThis.history.replaceState = console.log
}

export function restore() {
    if(real.replaceState) {
        globalThis.history.replaceState = real.replaceState
    }
}