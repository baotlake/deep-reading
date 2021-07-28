/**
 * detect website refused to display, like: mdn.org
 * @returns
 */
export function detectRefusedDisplay() {
    let height = window.innerHeight
    let width = window.innerWidth

    let points = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
        [(width - 1) * Math.random(), (height - 1) * Math.random()],
    ]

    let elements = points.map((point) => {
        return document.elementFromPoint(point[0], point[1])
    })

    let refused = elements.reduce(
        (isEqual, element) => isEqual && element === elements[0],
        true
    )

    let contents = document.querySelectorAll('div,span,p,h1')
    if (contents.length < 15) {
        for (let i = 0; i < contents.length; i++) {
            let textLength = contents[i].textContent.length
            let rect = contents[i].getBoundingClientRect()
            if (textLength > 0 && rect.height * rect.width > 0) {
                refused = false
            }
        }
    }

    return refused
}
