import { styled } from "@mui/system"
import { ButtonBase } from "@mui/material"
import { alpha } from '@mui/material/styles'

export const Container = styled('div')({
    position: 'relative',
    boxSizing: 'border-box',
    fontSize: 16,
    margin: 48 / 16 + 'em auto',
    transition: 'all 0.3s',
    maxWidth: '36em',

    '&.invalid': {
        animation: `headShake 1s ease-in-out 0s 1`,
    },
})

export const InputLabel = styled('label')`
    position: absolute;
    background: white;
    font-size: ${12 / 16 + 'em'};
    padding: 0 ${5 / 12 + 'em'};
    color: red;
    top: 0;
    left: ${(46 - 5) / 12 + 'em'};
    transform: translateY(-50%);
    z-index: 1;
`

export const Bar = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    height: 46 / 16 + 'em',
    borderRadius: 23 / 16 + 'em',
    justifyContent: 'space-between',

    // outline: '1px rgba(0, 0, 0, 0.1) solid',
    boxShadow: `0 0 0 1px rgba(0,0,0,0.2), 0 0 0 0 ${alpha(theme.palette.primary.main, 0.3)}`,
    boxSizing: 'border-box',
    alignItems: 'center',
    transition: 'box-shadow 0.3s',
    color: theme.palette.primary.main,
    overflow: 'hidden',

    '&.focus': {
        // outline: `1px solid currentColor`,
        boxShadow: `0 0 0 1px currentColor, 0 0 0 ${3 / 16 + 'em'} ${alpha(theme.palette.primary.main, 0.3)}`
    },
    '&:active': {
        // outline: `1px solid currentColor`,
        boxShadow: `0 0 0 1px currentColor, 0 0 0 ${5 / 16 + 'em'} ${alpha(theme.palette.primary.main, 0.3)}`
    },
    '&.invalid': {
        boxShadow: 'none',
    },

    '@keyframes headShake': {
        '0%': {
            transform: `translateX(0)`,
        },
        '6.5%': {
            transform: `translateX(-6px) rotateY(-9deg)`,
        },
        '18.5%': {
            transform: `translateX(5px) rotateY(7deg)`,
        },
        '31.5%': {
            transform: `translateX(-3px) rotateY(-5deg)`,
        },
        '43.5%': {
            transform: `translateX(2px) rotateY(3deg)`,
        },
        '50%': {
            transform: `translateX(0)`,
        },
    },
}))


export const ScannerButton = styled(ButtonBase)`
    height: 100%;
    font-size: ${13 / 16 + 'em'};
    width: ${46 / 13 + 'em'};
    flex: none;
`
export const Input = styled('input')(({ theme }) => ({
    height: `100%`,
    width: `100%`,
    boxSizing: `border-box`,
    outline: `none`,
    border: `none`,
    color: theme.palette.primary.dark,
}))

export const ClearButton = styled(ButtonBase)({
    height: 38 / 16 + 'em',
    width: 38 / 16 + 'em',
    padding: 8 / 16 + 'em',
})

export const GoButton = styled(ButtonBase)(({ theme }) => ({
    fontSize: 'inherit',
    height: '100%',
    width: '4em',
    flex: 'none',
    backgroundColor: theme.palette.primary.main,
    color: 'white',

    '&[type=button]': {
        backgroundColor: theme.palette.primary.main,
    },
}))

