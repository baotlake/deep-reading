/**
 *
 * @param {number} size
 * @param {number} maxNumber
 * @param {string} text
 * @returns
 */
export const calcFontSize = (size: number, maxNumber: number, text: string) => {
    /**size:初始字符大小, maxNumber:初始字符大小下可以显示的最大字符, text：当前字符 */
    if (!text) return size
    if (text.length <= maxNumber) return size
    return (size * maxNumber) / text.length
}

export function positionStyle(coordinate: [number, number], zoom = 0) {
    const ew = 17 // em explanation width 宽度
    const eh = 8 // em explanation height 高度
    const aw = 2.8 // em arrow width 三角箭头宽度
    const ah = 2.8 // em arrow height 三角箭头高度
    const topDistance = 12 // em 顶部距离小于topDistance时,expainPanel显示在单词下方
    const wordDistance = 3 // em expainPanel距离单词的距离
    const edgeDistance = 1 // em 最小左右边距
    const arrowOverlapping = 0.1 // 箭头和框的重叠距离
    const remRatioPx = 14 // 1 rem = 16 px

    let position = {
        top: '',
        left: '',
    }
    let arrowPosition = {
        top: '',
        left: '',
    }
    if (!coordinate) return [position, arrowPosition]

    if (typeof zoom !== 'number') zoom = 0
    let [x, y] = coordinate

    let vw, vh
    if (typeof window === 'undefined') {
        ;[vw, vh] = [1920, 1080]
    } else {
        ;[vw, vh] = [window.innerWidth, window.innerHeight]
    }

    let ratio = remRatioPx + remRatioPx * zoom

    //纵向位置 Vertical position
    if (y >= topDistance * ratio) {
        // expainPanel显示在单词上方
        position.top = `calc(${y}px - ${eh}em - ${wordDistance}em)`
        // arrowStyle.transform = 'rotate(180deg)'
        arrowPosition.top = `${eh - ah / 2 - arrowOverlapping}em`
    } else {
        // expainPanel显示在单词下方
        position.top = `calc(${y}px + ${wordDistance}em)`
        arrowPosition.top = `-${ah / 2 - arrowOverlapping}em`
        // arrowStyle.transform = 'rotate(0deg)';
    }

    // 横向位置 Horizontal position
    if (x >= vw - (ew / 2 + edgeDistance) * ratio) {
        // 单词位置靠右边框
        position.left = `calc(${vw}px - ${ew}em - ${edgeDistance}em)`
        // 太偏右 调整
        if (vw - x < edgeDistance * ratio + (aw / 2) * ratio)
            x = vw - (edgeDistance * ratio + (aw / 2) * ratio)
        arrowPosition.left = `calc(${x - vw}px + ${
            ew + edgeDistance - aw / 2
        }em)`
    } else if (x <= (ew / 2 + edgeDistance) * ratio) {
        // 单词位置靠左边框
        position.left = `${edgeDistance}em`
        // 太偏左 调整
        if (x < edgeDistance * ratio + (aw / 2) * ratio)
            x = edgeDistance * ratio + (aw / 2) * ratio
        arrowPosition.left = `calc(${x}px - ${edgeDistance + aw / 2}em)`
    } else {
        // 中间
        position.left = `calc(${x}px - ${ew / 2}em)`
        arrowPosition.left = `${ew / 2 - aw / 2}em`
    }

    return [position, arrowPosition]
}
