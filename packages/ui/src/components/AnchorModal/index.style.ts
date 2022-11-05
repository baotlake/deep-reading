import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const Box = styled('div')({
    position: "fixed",
    bottom: -160 / 16 + 'em',
    display: "flex",
    width: '80%',
    maxWidth: 300 / 16 + 'em',
    height: 48 / 16 + 'em',
    left: '50%',
    transform: `translateX(-50%) scale(0.5)`,
    transition: `all 0.3s cubic-bezier(0.42, 1.02, 0.7, 1.09)`,
    boxShadow: `0 0 ${10 / 16 + 'em'} rgba(0, 0, 0, 0.2)`,
    pointerEvents: 'all',
    overflow: 'hidden',
    zIndex: 99,
    borderRadius: 6 / 16 + 'em',
    fontSize: 'inherit',

    '&.visible': {
        transform: `translateX(-50%) scale(1)`,
        bottom: 96 / 16 + 'em',
    }
})

export const UrlBox = styled("div")({
    userSelect: 'none',
    width: '80%',

    padding: `${6 / 16 + 'em'} ${10 / 16 + 'em'}`,
    boxSizing: 'border-box',
    borderRadius: `${6 / 16 + 'em'} 0 0 ${6 / 16 + 'em'}`,
    backgroundColor: 'white',
    cursor: 'pointer',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRightColor: 'transparent',
    overflowX: 'auto',


    '&::-webkit-scrollbar': {
        display: 'none',
    },

    '> div': {
        whiteSpace: 'nowrap',
        fontSize: 14 / 16 + 'em',
        lineHeight: 20 / 14 + 'em',
    },
    '> pre': {
        fontFamily: 'inherit',
        margin: 0,
        color: 'rgba(0,0,0,0.6)',
        fontSize: 10 / 16 + 'em',
        lineHeight: 16 / 14 + 'em',
    }
})

export const GoButton = styled(Button)({
    height: `100%`,
    width: `${40 / 16 + 'em'}`,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'inherit',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: `0 ${6 / 16 + 'em'} ${6 / 16 + 'em'} 0`
})
