import { styled } from '@mui/material/styles'
import LogoSvg from '../../../resource/svg/logo-name.svg?svgr'
import OpenSvg from '../../../resource/icon/open-window.svg?svgr'


export const Box = styled('div')({
    display: 'flex',
    width: '100%',
    padding: '0.75em 1.5em',
})

export const LogoLink = styled('a')({
    marginRight: '0.75em',
})

export const Logo = styled(LogoSvg)({
    width: '53px',
    height: '20px',
})

export const GhLink = styled('a')({
    marginRight: '0.75em',
    display: 'flex',
    alignItems: 'center',
})

export const OpenIcon = styled(OpenSvg)({
    marginLeft: '0.25em',
})