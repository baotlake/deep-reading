import { useEffect } from "react"
import { useRouter } from "next/router"
import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box'
import { styled, alpha } from "@mui/system"

import FirstLeftIllusSvg from '../assets/illustration/home_first_left.svg?svgr'
import FirstRightIllusSvg from '../assets/illustration/home_first_right.svg?svgr'
import Logo from '../assets/logo.svg?svgr'
import SecondIllusSvg from '../assets/illustration/home_second.svg?svgr'

const FirstScreenBox = styled('div')({
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '600px',
})

const FirstLeftSvgWrapper = styled('div')({
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

const FirstRightSvgWrapper = styled('div')({
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

const StyledLogo = styled(Logo)({
    margin: '30px',
    width: '182px',
    height: '66px',

    '@media screen and (max-width: 600px)': {
        margin: '30px 15px',
    },
})

const SecondScreenBox = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    margin: '20vh 0',
}))

const SecondIllusWrapper = styled('div')({
    aspectRatio: '1000/900',
    height: '70%',
    maxWidth: '100%',

    '> svg': {
        width: '100%',
        height: '100%',
    }
})

export default function Index() {
    const router = useRouter()
    useEffect(() => {
        // router.push('/start')
    }, [])

    return (
        <>
            <Box>
                <FirstScreenBox>
                    <FirstRightSvgWrapper>
                        <FirstRightIllusSvg />
                    </FirstRightSvgWrapper>
                    <FirstLeftSvgWrapper>
                        <FirstLeftIllusSvg />
                    </FirstLeftSvgWrapper>
                    <StyledLogo />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 'clamp(25%, 18vw, 42%)',
                            width: '100%',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: 'rgba(0,0,0,0.8)',
                            fontSize: 'clamp(2em, 100px, 12vw)',
                        }}
                    >
                        轻松阅读英语
                        <Box
                            sx={{
                                color: 'primary.main',
                                fontSize: '0.45em',
                                filter: 'brightness(0.8)',
                            }}
                        >秒查词，秒翻译，全平台支持</Box>
                    </Box>
                </FirstScreenBox>

                <SecondScreenBox>
                    <Box
                        sx={{
                            fontSize: 'clamp(2em, 100px, 12vw)',
                            fontWeight: 'bold',
                            color: 'rgba(0,0,0,0.8)',
                            margin: '0 30px',
                        }}
                    >
                        开放式生态

                        <Box
                            sx={{
                                color: 'primary.main',
                                fontSize: '0.45em',
                                filter: 'brightness(0.8)',
                            }}
                        >
                            自由探索海量内容资讯
                        </Box>
                    </Box>
                    <SecondIllusWrapper >
                        <SecondIllusSvg />
                    </SecondIllusWrapper>
                </SecondScreenBox>

                <Box
                    sx={{
                        margin: '90px 60px',
                        color: 'rgba(0,0,0,0.6)',
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        一个好用的在线网页点读笔，划词点读翻译，轻松阅读英语原文。
                    </Typography>

                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            marginTop: '1em',
                        }}
                    >
                        新闻、书籍、文档、博客等都可以在这里找到。
                        开放式的阅读模式，你可以尝试将你喜欢的任何网页在首页的输入框中打开。
                        还有更强大的deep reading浏览器插件，现已支持手机平板(Android)和电脑。
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
                        再也不用担心词汇量不够了，用Deep Reading，点一下查生词，英语原文阅读更流畅。
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            marginTop: '2em',
                        }}
                    >
                        一“划” 即刻翻译
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
            </Box>
        </>
    )
}