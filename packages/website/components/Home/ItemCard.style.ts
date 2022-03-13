import { styled } from '@mui/system'
import { alpha } from '@mui/material'

export const Wrapper = styled('div')(({ theme }) => ({
    '&:hover': {
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`
    }
}))
