import ButtonBase from '@mui/material/ButtonBase'
import { styled, alpha } from '@mui/material/styles'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import BoltIcon from '@mui/icons-material/Bolt'

export const Box = styled('div')({
    margin: '1.25em auto',
})

export const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    fontSize: '1em',
    padding: '0.625em 1.25em',
    justifyContent: 'start',
    borderRadius: '0.5em',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: alpha(theme.palette.primary.main, 0.3),
    color: theme.palette.primary.main,

    '> span': {
        color: theme.palette.primary.dark,
        fontSize: '0.875em',
    }
}))

export const LayersIcon = styled(LayersRoundedIcon)({
    marginRight: '0.5em',
    fontSize: '1.25em',
})

export const HelpIcon = styled(HelpOutlineIcon)({
    marginLeft: '0.5em',
    fontSize: '1.25em',
})

export const PowerIcon = styled(PowerSettingsNewIcon)({
    marginRight: '0.5em',
    fontSize: '1.25em',
})

export const StyledBoltIcon = styled(BoltIcon)({
    marginLeft: '0.2em',
    fontSize: '1.25em',
})