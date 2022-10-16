import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'


export const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    fontSize: '1em',
    padding: '0.625em 1.25em',
    margin: '0.875em 0',
    borderRadius: '0.5em',
    alignItems: 'center',
    justifyContent: 'start',
    color: 'rgba(0,0,0,0.85)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.1)',

    '&:hover': {
        color: theme.palette.primary.main,
    },

    '&.active': {
        background: alpha(theme.palette.primary.main, 0.15),
        color: theme.palette.primary.dark,
        borderColor: alpha(theme.palette.primary.main, 0.6),
        fontWeight: 'bold',
    },

    '> svg': {
        marginRight: '0.5em',
        height: '1.25em',
        width: '1.25em',
    },

    '> span': {
        fontSize: '0.875em',
    }
}))
