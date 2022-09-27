import type { CSSObject } from "@mui/material/styles"


export const absoluteCenterAlign: CSSObject = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
}

export const svgBorderStyle: CSSObject = {
    ...absoluteCenterAlign,
    width: '100%',
    height: '100%',
    boxSizing: 'content-box',
    pointerEvents: 'none',

    '> svg': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },

    'path': {
        transition: 'all 0.2s',
    }
}

export const closeButtonStyle = (size: string) => (<CSSObject>{
    position: 'absolute',
    top: 0,
    right: 0,
    width: size,
    height: size,
    cursor: 'pointer',
    boxSizing: 'content-box',
    color: '#8a8a8a',
    WebkitTapHighlightColor: 'transparent',
})