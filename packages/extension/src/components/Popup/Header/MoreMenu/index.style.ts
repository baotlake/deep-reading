import { styled } from '@mui/material/styles'
import ButtonBase from '@mui/material/ButtonBase'

export const Box = styled('div')({
    position: 'relative',
})

export const Menu = styled('div')({
    position: 'absolute',
    top: '100%',
    marginTop: '0.375em',
    right: 0,
    background: 'white',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '0.375em',
    zIndex: 10,
    padding: '0.375em 0',
})

export const MenuItem = styled(ButtonBase)(({ theme }) => ({
    fontSize: '0.875em',
    padding: '0 1em',
    whiteSpace: 'nowrap',
    display: 'flex',

    '&:hover': {
        color: theme.palette.primary.main,
    },
}))