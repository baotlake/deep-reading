import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import LogoSvg from '../../../resource/svg/logo-name.svg?svgr'
import OpenIcon from '../../../resource/icon/open-window.svg?svgr'

const Logo = styled(LogoSvg)({
    width: '53px',
    height: '20px',
})

export function Footer() {

    return (
        <Box className='flex w-full px-6 py-3'>
            <a
                href="https://wrp.netlify.app"
                target="_blank"
                className='mr-3'
            >
                <Logo className='' />
            </a>
            <a
                href="https://github.com/baotlake/deep-reading"
                target="_blank"
                className='mr-3 flex items-center'
            >
                GitHub
                <OpenIcon className='ml-1' />
            </a>
        </Box>
    )
}