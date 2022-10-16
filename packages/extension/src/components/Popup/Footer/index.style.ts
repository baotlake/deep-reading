import { styled } from '@mui/material/styles'
import OpenSvg from '../../../resource/icon/open-window.svg?svgr'


export const Box = styled('div')({
    display: 'flex',
    width: '100%',
    padding: '0.5em 1.5em',
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'space-evenly',
})

export const Link = styled('a')(({ theme }) => ({
    fontSize: '0.75em',
    textDecoration: 'none',
    color: theme.palette.primary.dark,

    '&:hover': {
        color: theme.palette.primary.main,
    }
}))

export const OpenIcon = styled(OpenSvg)({
    marginLeft: '0.25em',
})