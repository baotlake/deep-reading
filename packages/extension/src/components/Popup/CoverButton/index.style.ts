import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'

export const Box = styled('div')({
    margin: '1.5em auto',
})

export const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: '0.75em 1.25em',
    justifyContent: 'start',
    background: 'whitesmoke',
    borderRadius: '0.375em',

    color: theme.palette.primary.main,

    '> span': {
        color: theme.palette.primary.dark,
    }
}))

export const LayersIcon = styled(LayersRoundedIcon)({
    marginRight: '0.5em',
    height: '1.5em',
    width: '1.5em'
})