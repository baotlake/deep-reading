
import { styled } from "@mui/system"
import { alpha } from '@mui/material'
import IconButton from '@mui/material/IconButton'


export const Box = styled('div')(({ theme }) => ({
    // background: alpha(theme.palette.primary.main, 0.05),
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    maxWidth: '100%',
    height: '100vh',
    boxSizing: 'border-box',
    border: `3px dashed ${alpha(theme.palette.primary.main, 0.6)}`,
    overflow: 'hidden',
    borderRadius: '0 0 10px 10px',
    pointerEvents: 'all',

    '&::before': {
        position: 'absolute',
        content: '""',
        display: 'block',
        width: 'max(200vw, 200vh)',
        height: 'max(200vw, 200vh)',
        borderRadius: '50%',
        background: theme.palette.primary.main,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transformOrigin: 'center center',
        animation: 'zoomIn 0.8s ease forwards',
        pointerEvents: 'none',
    },

    '&.through': {
        pointerEvents: 'none',
        opacity: 0.5,
    },

    '&.wheel-through': {
        pointerEvents: 'none',
    },

    '@keyframes zoomIn': {
        '0%': {
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0.2,
        },
        '100%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0.05,
        },
    }
}))

export const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '1em',
    right: '1em',
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.5),
    backdropFilter: 'blur(2px)',
    pointerEvents: 'all',
    
    '> svg': {
        color: 'white',
    }
}))