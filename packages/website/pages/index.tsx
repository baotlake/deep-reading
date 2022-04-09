import { useEffect } from "react"
import { useRouter } from "next/router"
import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box'

export default function Index() {
    const router = useRouter()
    useEffect(() => {
        // router.push('/start')
    }, [])

    return (
        <>
            <Box
                sx={{
                    margin: '5em auto',
                    // textAlign: 'center',
                    padding: '0 2em',
                    maxWidth: '90%',
                    boxSizing: 'border-box',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Deep Reading
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    一个好用的在线网页点读笔，点读翻译，让你无障碍阅读英语。
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        marginTop: '1em',
                    }}
                >
                    新闻、书籍、文档、博客你都可以在这里找到。
                    开放式的阅读模式，你可以尝试将你喜欢的任何网页在首页的输入框中打开。
                    还有更厉害的deep reading浏览器插件，现已支持手机平板(Android)和电脑。
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        marginTop: '1em',
                    }}
                >
                    如果这里打不开你要阅读的网页，请不要气馁，浏览器插件可以给你全新的可能。
                </Typography>


                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                        marginTop: '2em',
                    }}
                >
                    一“点” 轻松查词
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                >
                    再也不用担心词汇量不够了，用Deep Reading，点一下查生词，英文原文阅读更流畅。
                </Typography>

                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                        marginTop: '2em',
                    }}
                >
                    一“扫” 即刻翻译
                </Typography>

                <Typography variant="body1" gutterBottom>
                    用手指横向轻扫，翻译整句。
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        marginTop: '3em'
                    }}
                >
                </Typography>
            </Box>
        </>
    )
}