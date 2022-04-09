import React from 'react'

export default function Point({
    position,
    size,
    color,
}: {
    position: [number, number]
    size?: number
    color?: string
}) {
    size = size || 4
    color = color || 'red'

    return (
        <div
            style={{
                position: 'absolute',
                left: position[0],
                top: position[1],
                width: size,
                height: size,
                transform: `translate(-${size / 2}px, -${size / 2}px)`,
                backgroundColor: color,
                pointerEvents: 'none',
            }}
        />
    )
}
