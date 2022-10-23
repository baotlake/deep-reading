import { styled } from '@mui/material/styles'

export const Base = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999999999999999,
    color: 'black',
    textAlign: 'left',
    fontSize: '16px',
    fontFamily: 'sans-serif',
})

export const InvisibleFrame = styled('iframe')`
    position: fixed;
    bottom: 0;
    right: 0;
    height: 0;
    width: 0;
    opacity: 0;
    visibility: none;
    border: none;
    outline: none;
`