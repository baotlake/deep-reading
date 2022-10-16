import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import PublicIcon from '@mui/icons-material/Public'
import { styled } from '@mui/material/styles'

export const Wrapper = styled(Box)({
    position: 'relative',

    '&.inactive': {
        opacity: 0.3,
        filter: 'grayscale(1)',
    }
})

export const GlobalIcon = styled(AllInclusiveIcon)({})

export const HostIcon = styled('img')({
    width: '1.25em',
    height: '1.25em',
})

export const WebsiteIcon = styled(PublicIcon)({})


export const StyledTab = styled(Tab)({
    minHeight: 'auto',
})