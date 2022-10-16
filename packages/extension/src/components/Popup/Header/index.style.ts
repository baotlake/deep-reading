import { styled, alpha } from "@mui/material/styles"
import ButtonBase from '@mui/material/ButtonBase'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LogoSvg from '../../../resource/svg/logo-name.svg?svgr'

export const Box = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
})

export const Logo = styled(LogoSvg)({
    width: '7.5em',
    height: '2.875em',
    cursor: 'pointer',
    marginRight: 'auto',
})

export const Button = styled(ButtonBase)(({ theme }) => ({
    fontSize: '1em',
    width: '1.875em',
    height: '1.875em',
    borderRadius: '0.5em',
    border: '1px solid rgba(0,0,0,0.1)',
    marginLeft: '1em',

    '&.warning': {
        color: theme.palette.warning.main,
        borderColor: alpha(theme.palette.warning.main, 0.3)
    },
    '&.primary': {
        borderColor: alpha(theme.palette.primary.light, 1),
        background: alpha(theme.palette.primary.main, 1),
        color: 'white',
    }
}))

export const PowerIcon = styled(PowerSettingsNewIcon)({
    fontSize: '1.25em',
})

export const MoreIcon = styled(MoreHorizIcon)({
    fontSize: '1.25em',
})