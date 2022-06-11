import { styled } from '@mui/system'

export const Page = styled('div')({
    padding: `0 0 90px 0`,
    paddingBottom: `calc(env(safe-area-inset-bottom) + 56px + 20px)`,
})

export const Header = styled('header')({
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
})

export const ListContainer = styled('div')({

    '> div': {
        borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
    },
    '> div:first-of-type': {
        borderTop: `1px solid rgba(0, 0, 0, 0.1)`,
    }
})
