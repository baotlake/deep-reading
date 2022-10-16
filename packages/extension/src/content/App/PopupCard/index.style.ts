import { styled } from '@mui/material/styles'

export const Box = styled('div')({
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.2)',
    top: 0,
    left: 0,
    zIndex: 9e10,
    animation: '0.18s ease-in-out 0s 1 both fadeIn',

    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
        },
        '100%': {
            opacity: 1,
        }
    }
})

export const Card = styled('div')({
    position: 'absolute',
    top: '2em',
    right: '2em',
    width: '300px',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    background: 'white',
    borderRadius: '0.5em',
    animation: '0.18s ease-in-out 0s 1 both sideInRight',


    '@keyframes sideInRight': {
        '0%': {
            transform: 'translate(100%, 0%) scale(1)'
        },
        '100%': {
            transform: 'translate(0%, 0%) scale(1)'
        },
    }
})
