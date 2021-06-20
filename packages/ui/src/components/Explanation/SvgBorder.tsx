//

interface Props {
    ratioX: number // 0 ~ 1
    direction: 'up' | 'down' // opposite arrow direction
}

export default function SvgBorder({ ratioX, direction }: Props) {
    const width = 255
    const height = 120
    const radius = 12
    const arrowHeight = 30
    const arrowWidth = 26
    const arrowRealHeightRatio = 0.6
    const marginY = 15
    const marginX = 15

    let arrowBottomCenterX = () => {
        let x = ratioX * width
        let minX = radius + arrowWidth / 2
        if (x < minX) {
            return minX
        }
        let maxX = width - radius - arrowWidth / 2
        if (x > maxX) {
            return maxX
        }
        return x
    }
    let arrowX1 = arrowBottomCenterX()

    let arrowTopApexX = () => {
        let x = ratioX * width
        x = arrowX1 + (x - arrowX1) * arrowRealHeightRatio
        return x
    }
    let arrowX2 = arrowTopApexX()

    let downPathD = () => {
        let topY = arrowHeight
        let bottomY = height + arrowHeight
        let arrowY2 = arrowHeight * (1 - arrowRealHeightRatio)

        let d = `M${radius},${topY} L${
            arrowX1 - arrowWidth / 2
        },${topY} L${arrowX2},${arrowY2} L${
            arrowX1 + arrowWidth / 2
        },${topY} L${
            width - radius
        },${topY} a${radius} ${radius} 90 0 1 ${radius},${radius} L${width},${
            topY + radius
        } L${width},${
            bottomY - radius
        } a${radius} ${radius} 90 0 1 ${-radius},${radius} L${
            width - radius
        },${bottomY} L${radius},${bottomY} a${radius} ${radius} 90 0 1 ${-radius},${-radius} L${0},${
            bottomY - radius
        } L${0},${
            topY + radius
        } a${radius},${radius},90,0,1,${radius},${-radius} Z`

        return d
    }

    let upPathD = () => {
        let topY = arrowHeight
        let bottomY = height + arrowHeight
        let arrowY2 = bottomY + arrowHeight * arrowRealHeightRatio

        let d = `M${radius},${topY} L${
            width - radius
        },${topY} a${radius} ${radius} 90 0 1 ${radius},${radius} L${width},${
            topY + radius
        } L${width},${
            bottomY - radius
        } a${radius} ${radius} 90 0 1 ${-radius},${radius} L${
            width - radius
        },${bottomY} L${
            arrowX1 + arrowWidth / 2
        },${bottomY} L${arrowX2},${arrowY2} L${
            arrowX1 - arrowWidth / 2
        },${bottomY} L${radius},${bottomY} a${radius} ${radius} 90 0 1 ${-radius},${-radius} L${0},${
            bottomY - radius
        } L${0},${
            topY + radius
        } a${radius},${radius},90,0,1,${radius},${-radius} Z`

        return d
    }

    let pathD = () => {
        if (direction === 'down') return downPathD()
        return upPathD()
    }

    return (
        <svg
            viewBox={`${0 - marginX} ${0 - marginY} ${width + marginX * 2} ${
                height + arrowHeight * 2 + marginY * 2
            }`}
        >
            <filter id="dropshadow" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                {/* stdDeviation is how much to blur */}
                <feOffset dx="0" dy="0" result="offsetblur" />
                {/* how much to offset */}
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.15" />
                    {/*  slope is the opacity of the shadow */}
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    {/* this contains the offset blurred image */}
                    <feMergeNode in="SourceGraphic" />
                    {/* this contains the element that the filter is applied to */}
                </feMerge>
            </filter>
            <path
                d={pathD()}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="0.5"
                fill="white"
                style={{ filter: 'url(#dropshadow)' }}
            ></path>
        </svg>
    )
}
