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

    console.log(elements)
    return elements.reduce(
        (isEqual, element) => isEqual && element === elements[0],
        true
    )
}
