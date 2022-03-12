import { styled } from '@mui/system'

export const Container = styled('div')({
    position: 'fixed',
    width: '100vw',
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: `0 0 1em rgba(200,200,200,0.5)`,
    zIndex: 10,

    '&.hidden': {
        bottom: '-100%',
    }
})