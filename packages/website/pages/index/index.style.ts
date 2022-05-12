import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box'
import { styled, alpha } from '@mui/system'

import Logo from '../../assets/logo_name.svg?svgr'
import GithubIconSvg from '../../assets/svg/github.svg?svgr'

export const Header = styled('header')({
    height: '60px',
    width: '100%',
    padding: '0 60px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',

    '@media screen and (max-width: 600px)': {
        padding: '0 15px',
    },
})

export const StyledLogo = styled(Logo)({
    // 182, 66
    width: '110px',
    height: '40px',
    marginRight: '20px',
})

export const HeaderLink = styled('a')(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    margin: '0 10px',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
}))

export const GithubIcon = styled(GithubIconSvg)({
    width: '20px',
    height: '20px',
})

export const FirstScreenBox = styled('div')({
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '600px',
})

export const FirstLeftSvgWrapper = styled('div')({
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '600px',
    maxHeight: '100%',
    aspectRatio: '660/1080',
    zIndex: '-1',

    '> svg': {
        width: '100%',
        height: '100%',
    }
})

export const FirstRightSvgWrapper = styled('div')({
    position: 'absolute',
    right: 0,
    height: '100%',
    minWidth: '600px',
    aspectRatio: '900/1080',
    zIndex: '-1',
    // maxHeight: '100%',
    display: 'none',

    '> svg': {
        width: '100%',
        height: '100%',
    },

    '@media screen and (min-width: 900px)': {
        display: 'block',
    }
})

export const SecondScreenBox = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    margin: '20vh 0',
}))

export const SecondIllusWrapper = styled('div')({
    aspectRatio: '1000/900',
    height: '70%',
    maxWidth: '100%',

    '> svg': {
        width: '100%',
        height: '100%',
    }
})
