import { styled } from '@mui/system'

export const ViewWrapper = styled('div')({
    position: 'relative',
    width: '100%',
    height: '100vh',
    boxSizing: `border-box`,
    paddingBottom: `env(safe-area-inset-bottom)`,
})

export const IframeWrapper = styled('div')({
    width: '100%',
    height: '100%',
    boxSizing: `border-box`,
    paddingBottom: `56px`
})

export const Ifrmae = styled('iframe')({
    borderWidth: 0,
    width: '100%',
    height: '100%',
})
