
import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box'
import Button  from "@mui/material/Button"
import Link from "next/link"

export default function Uninstall() {
    return (
        <Box
            sx={{
                maxWidth: '80%',
                margin: '4em auto',
            }}
        >
            <Typography variant="h4" gutterBottom>给我们一些反馈</Typography>
            <Typography variant="subtitle1" gutterBottom>您可以回答以下问题，或者其他您想反馈的任何问题。</Typography>
            <Typography variant="subtitle1" gutterBottom>您觉得Deep Reading插件那些地方还需要改进？</Typography>
            <Typography variant="subtitle1" gutterBottom>您想使用Deep Reading插件来帮助您做什么？</Typography>
            <Typography variant="subtitle1" gutterBottom>您为什么卸载Deep Reading的插件？</Typography>
            <Typography variant="h4" gutterBottom>使用网页版</Typography>
            <Typography variant="subtitle1" gutterBottom>
                无需安装插件，您仍然可以继续使用Deep Reading。
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Deep Reading的网页版可以在几乎所有的平台使用，并且支持PWA。
            </Typography>
            <Link href="/explore">
                <Button variant="contained">尝试网页版</Button>
            </Link>
        </Box>
    )
}