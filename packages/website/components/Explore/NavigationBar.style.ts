import { styled } from '@mui/system'

export const Wrapper = styled('div')({
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    padding: 0,
    paddingTop: '0.5em',
    overflowX: 'scroll',
    background: 'var(--t-back-c)',
    boxShadow: 'var(--shadow-3)',
    zIndex: 99,

    '&::-webkit-scrollbar': {
        display: 'none',
    }
})

export const Container = styled('ul')({
    display: 'flex',
    padding: '0 0.5em',
    boxSizing: 'border-box',
    margin: 'inherit',
})

export const Item = styled('li')(({ theme }) => ({
    padding: '0.5em',
    margin: '0 0.5em',
    listStyle: 'none',
    textAlign: 'center',
    minWidth: '4em',

    '&.selected': {
        color: theme.palette.primary.main,
        fontWeigth: 'blob',
        position: 'relative',

        '&::before': {
            content: '""',
            width: '100%',
            height: 3,
            bottom: 0,
            left: 0,
            borderRadius: 2,
            position: 'absolute',
            background: theme.palette.primary.main,
        }
    }
}))

