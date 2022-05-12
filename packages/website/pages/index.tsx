import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box'
import Link from "next/link"

import FirstLeftIllusSvg from '../assets/illustration/home_first_left.svg?svgr'
import FirstRightIllusSvg from '../assets/illustration/home_first_right.svg?svgr'
import SecondIllusSvg from '../assets/illustration/home_second.svg?svgr'

import {
    Header,
    StyledLogo,
    HeaderLink,
    GithubIcon,
    FirstScreenBox,
    FirstLeftSvgWrapper,
    FirstRightSvgWrapper,
    SecondScreenBox,
    SecondIllusWrapper,
} from './index.style'

export default function Index() {
    return (
        <>
            <Header>
                <StyledLogo />

                <Link href="/explore">
                    <HeaderLink href="/explore">
                        发现
                    </HeaderLink>
                </Link>

                <HeaderLink
                    href={'https://github.com/baotlake/deep-reading'}
                    target="_blank"
                >
                    <GithubIcon />
                </HeaderLink>

            </Header>
            <Box>
                <FirstScreenBox>
                    <FirstRightSvgWrapper>
                        <FirstRightIllusSvg />
                    </FirstRightSvgWrapper>
                    <FirstLeftSvgWrapper>
                        <FirstLeftIllusSvg />
                    </FirstLeftSvgWrapper>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 'clamp(25%, 18vw, 42%)',
                            width: '100%',
                            textAlign: 'center',
                            fontSize: 'clamp(2em, 100px, 12vw)',
                            lineHeight: 1.5,
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'rgba(0,0,0,0.8)',
                                fontWeight: 'bold',
                                fontSize: '1em',
                            }}
                        >
                            轻松阅读英语
                        </Typography>
                        <Link
                            href="/explore"
                        >
                            <Typography
                                sx={{
                                    color: 'primary.main',
                                    fontSize: '0.45em',
                                    filter: 'brightness(0.8)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                                variant="subtitle1"
                            >秒查词，秒翻译，全平台支持</Typography>
                        </Link>
                    </Box>
                </FirstScreenBox>

                <SecondScreenBox>
                    <Box
                        sx={{
                            fontSize: 'clamp(2em, 100px, 12vw)',
                            margin: '0 30px',
                            lineHeight: 1.5,
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '1em',
                                fontWeight: 'bold',
                                color: 'rgba(0,0,0,0.8)',
                            }}
                            variant="h1"
                        >
                            开放式生态
                        </Typography>
                        <Link
                            href="/start"
                        >
                            <Typography
                                sx={{
                                    color: 'primary.main',
                                    fontSize: '0.48em',
                                    filter: 'brightness(0.8)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                                variant='subtitle1'
                            >
                                自由探索海量内容资讯
                            </Typography>
                        </Link>
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
                        一“点” 秒查词
                    </Typography>

                    <Typography
                        variant="body1"
                        gutterBottom
                    >
                        不用担心单词不认识，点一下查生词，英语原文阅读更流畅。
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            marginTop: '2em',
                        }}
                    >
                        一“划” 秒翻译
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        用手指横向轻划，翻译整句。
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