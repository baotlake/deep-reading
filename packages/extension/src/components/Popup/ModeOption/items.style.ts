import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'


export const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: '12px 20px',
    background: 'whitesmoke',
    margin: '16px 0',
    borderRadius: '6px',
    alignItems: 'center',
    justifyContent: 'start',

    '&:hover': {
        color: theme.palette.primary.main,
    },

    '&.active': {
        background: alpha(theme.palette.primary.main, 0.15),
        color: theme.palette.primary.dark,
    },

    '> svg': {
        marginRight: '0.5em',
        height: '1.5em',
        width: '1.5em',
    },

    '> span': {
    }
}))
