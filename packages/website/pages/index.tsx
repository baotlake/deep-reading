import Link from "next/link"
import { useRouter } from "next/router"
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography"
import Fab from "@mui/material/Fab"
import { useRepo } from "../hooks/useRepo"
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined'

import FirstLeftIllusSvg from '../assets/illustration/home_first_left.svg?svgr'
import FirstRightIllusSvg from '../assets/illustration/home_first_right.svg?svgr'
import SecondIllusSvg from '../assets/illustration/home_second.svg?svgr'

import {
    Header,
    StyledLogo,
    HeaderLink,
    A,
    Span,
    GithubIcon,
    FirstScreenBox,
    FirstLeftSvgWrapper,
    FirstRightSvgWrapper,
    SecondScreenBox,
    SecondIllusWrapper,
    ThirdScreenBox,
} from './index.style'


export default function Index() {
    // const repo = useRepo()
    const router = useRouter()
    const today = new Date()

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
                    <GithubIcon className="mr-1" />
                    {/* {repo.stargazers_count} */}
                </HeaderLink>

            </Header>
            <div>
                <FirstScreenBox>
                    <FirstRightSvgWrapper>
                        <FirstRightIllusSvg />
                    </FirstRightSvgWrapper>
                    <FirstLeftSvgWrapper>
                        <FirstLeftIllusSvg />
                    </FirstLeftSvgWrapper>
                    <Link
                        href="/explore"
                    >
                        <A
                            href="/explore"
                            sx={{
                                position: 'absolute',
                                top: 'clamp(25%, 18vw, 42%)',
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
                                    textAlign: 'justify',
                                }}
                            >
                                轻松阅读英语
                                <Span
                                    sx={{
                                        color: 'primary.dark',
                                        fontSize: '0.46em',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <br />{' '}
                                    秒查词，秒翻译，全平台支持
                                </Span>
                            </Typography>
                        </A>
                    </Link>
                </FirstScreenBox>

                <SecondScreenBox>
                    <Link
                        href="/start"
                    >
                        <A
                            href="/start"
                            sx={{
                                fontSize: 'clamp(2em, 100px, 12vw)',
                                margin: '0 30px',
                                lineHeight: 1.5,
                                // minHeight: '30%',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '1em',
                                    fontWeight: 'bold',
                                    color: 'rgba(0,0,0,0.8)',
                                    textAlign: 'justify',
                                }}
                                variant="h2"
                            >
                                开放式生态
                                <Span
                                    sx={{
                                        color: 'primary.dark',
                                        fontSize: '0.49em',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <br />{' '}
                                    自由探索海量内容资讯
                                </Span>
                            </Typography>
                        </A>
                    </Link>
                    <SecondIllusWrapper >
                        <SecondIllusSvg />
                    </SecondIllusWrapper>
                </SecondScreenBox>

                {/* <ThirdScreenBox>
                </ThirdScreenBox> */}

                <Fab
                    variant="extended"
                    color="primary"
                    sx={{
                        display: 'block',
                        margin: 'auto',
                        position: 'sticky',
                        bottom: '3em',
                    }}
                    onClick={() => router.push('/start')}
                >
                    <NavigationOutlinedIcon />
                    进入App
                </Fab>

                <div
                    className="text-zinc-900 my-24 mx-14"
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Deep Reading —— 青轻阅读是一个学习英语、阅读英语的APP。
                        你可以手机上、平板上或者电脑上使用青轻阅读浏览英语新闻、
                        学习英语、阅读英语文档或是阅读英语百科词条。
                        就像一个超方便的网页点读笔，划词点读翻译，轻松阅读英语原文。
                    </Typography>

                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            marginTop: '1em',
                        }}
                    >
                        青轻阅读不是为了提供一份最准确的翻译，
                        而是去尝试扫清英语原文阅读中的障碍，
                        <b>秒查词、秒翻译</b> —— 最便捷的查词和翻译，最小化原文阅读中的痛点。
                    </Typography>

                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            marginTop: '1em',
                        }}
                    >
                        为了更加专注于阅读，Web APP默认禁用了JS，第三方页面可能菜单不能正常点击。
                        另外由于一些无法跨越的技术限制，部分第三方页面无法正常打开。
                        如需避免这些问题，可使用扩展插件。
                        Web APP有更好的兼容性，扩展插件则提供了更好的用户体验。
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            marginTop: '2em',
                        }}
                    >
                        扩展插件（支持 Android 手机平板）
                    </Typography>

                    <Typography
                        variant="body1"
                        gutterBottom
                    >
                        <a className="text-blue-600" href="https://chrome.google.com/webstore/detail/deep-reading/oogkampbpcmckmfndhmehipcildkjfok">
                            Chrome 应用商店 - 青轻查词翻译
                        </a>
                        <br />
                        <a className="text-blue-600" href="https://microsoftedge.microsoft.com/addons/detail/deep-reading/acnfkkjcdomnfjdgkmcgilhnnopjbngk">
                            Edge 外接程序 - 青轻查词翻译
                        </a>
                        <br />
                        <a className="text-blue-600" href="https://addons.mozilla.org/zh-CN/firefox/addon/%E9%9D%92%E8%BD%BB%E6%9F%A5%E8%AF%8D%E7%BF%BB%E8%AF%91/">
                            Firefox 火狐插件 - 青轻查词翻译
                        </a>

                        <br />
                        <br />

                        Android 设备<b>推荐使用 Kiwi Browser 或 Firefox Nightly 安装插件</b>

                        <br />
                        Android Firefox Nightly 安装青轻阅读插件需要添加
                        <b>自定义附加组件收藏集</b>，
                        可使用用户ID: <code>17012247</code>
                        收藏集名称: <code className="select-all">mobile-addons</code>


                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            marginTop: '3em'
                        }}
                    >
                    </Typography>
                </div>
            </div>

            <Box
                className="w-full pb-20"
                sx={{ backgroundColor: 'primary.dark', color: 'white' }}
            >
                <Box className="flex max-w-5xl p-6 flex-wrap leading-loose" >
                    <span className="mx-5">
                        &copy; 2021-{today.getFullYear()} HUANYANG. All Rights Reserved.
                    </span>
                    <Link href="/privacy">
                        <a className="mx-5" href="/privacy">隐私</a>
                    </Link>
                    <Link href="/about">
                        <a className="mx-5" href="/about">关于</a>
                    </Link>
                    {/* <Link href="/extension">
                        <a className="mx-5" href="/extension">扩展插件</a>
                    </Link> */}
                    <a className="mx-5" href="https://github.com/baotlake/deep-reading" target="_blank" >GitHub</a>
                </Box>
            </Box>
        </>
    )
}