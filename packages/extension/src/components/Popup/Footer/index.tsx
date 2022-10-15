import { Box, LogoLink, Logo, GhLink, OpenIcon } from './index.style'

export function Footer() {
    return (
        <Box>
            <LogoLink href="https://wrp.netlify.app" target="_blank">
                <Logo />
            </LogoLink>
            <GhLink
                href="https://github.com/baotlake/deep-reading"
                target="_blank"
            >
                GitHub
                <OpenIcon />
            </GhLink>
        </Box>
    )
}
