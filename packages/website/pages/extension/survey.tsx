import Head from 'next/head'

import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box'
import Button from "@mui/material/Button"
import ChatIcon from '@mui/icons-material/Chat'
import Link from "next/link"

export default function Survey() {

    const feedback = () => {
        const tawkApi = window.Tawk_API
        if (tawkApi) {
            tawkApi.maximize()
        }
    }

    return (
        <>
            <Head>
                <title>插件反馈 - 青轻阅读 Deep Reading</title>
            </Head>
            <Box
                sx={{
                    maxWidth: '80%',
                    margin: '4em auto',
                }}
            >
                <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                        fontSize: '2em',
                    }}
                >给我们一些反馈</Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >您可以回答以下问题，或者其他您想反馈的任何问题。</Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >您觉得Deep Reading插件那些地方还需要改进？</Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >您想使用Deep Reading插件来帮助您做什么？</Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >您为什么卸载Deep Reading的插件？</Typography>

                <Button
                    startIcon={<ChatIcon />}
                    variant="outlined"
                    onClick={feedback}
                >
                    反馈
                </Button>

                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        fontSize: '2em',
                        marginTop: '60px',
                    }}
                >继续使用网页版</Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >
                    无需安装插件，您仍然可以继续使用Deep Reading。
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >
                    Deep Reading的网页版可以在几乎所有的平台使用，并且支持PWA。
                </Typography>
                <Link href="/explore">
                    <Button variant="outlined">尝试网页版</Button>
                </Link>
            </Box>
        </>
    )
}