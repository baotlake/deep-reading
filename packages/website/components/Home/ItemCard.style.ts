import { styled } from '@mui/system'
import { alpha } from '@mui/material'

export const A = styled('a')(({ theme }) => ({
    textDecoration: 'none',
    color: 'rgba(0,0,0,0.8)',
    boxSizing: 'border-box',
    boxShadow: '2px 2px 10px rgba(200, 200, 200, 0.5)',
    borderRadius: '5px',
    maxWidth: '560px',
    minWidth: '280px',
    height: '80px',
    padding: '10px 16px 10px 80px',
    position: 'relative',

    '&:hover': {
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`
    }
}))

export const Title = styled('div')({
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '24px',
})

export const ImageWrapper = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '80px',
    width: '80px',
    padding: '16px',
    boxSizing: 'border-box',

    '> img': {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    }
})

export const Description = styled('div')({
    fontSize: '12px',
    lineHeight: '18px',
    height: '36px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
})