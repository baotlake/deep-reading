import { Box, Link, OpenIcon } from './index.style'

export function Footer() {
    return (
        <Box>
            <Link
                href="https://github.com/baotlake/deep-reading"
                target="_blank"
            >
                GitHub
            </Link>
            <Link href="https://wrp.netlify.app" target="_blank">
                支持
            </Link>
            <Link href="https://wrp.netlify.app/privacy">
                隐私
            </Link>
            <Link href="">
                移动端
            </Link>
        </Box>
    )
}
