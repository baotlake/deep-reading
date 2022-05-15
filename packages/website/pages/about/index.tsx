import Head from 'next/head'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IosShareIcon from '@mui/icons-material/IosShare'
import ButtonGroup from '@mui/material/ButtonGroup'
import SvgIcon from '@mui/material/SvgIcon'
import GithubIconSvg from '../../assets/svg/github.svg?svgr'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { styled } from '@mui/system'
import { useState, useRef } from 'react'

import {
    Page,
    GuideBox,
    GuideImage,
    SupportBox,
    SupportItem
} from './index.style'

const A = styled('a')({})
const Img = styled('img')({})

const officialAccountName = '青轻阅读 Deep Reading'

export default function About() {
    const [officialAccountVisible, setOfficialAccountVisible] = useState(false)

    const handleCopy = () => {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(officialAccountName)
            return
        }
        const input = document.createElement('input')
        input.value = officialAccountName
        input.select()
        document.execCommand('copy')
    }
    return (
        <>
            <Head>
                <title>关于 - 青轻阅读 Deep Reading</title>
            </Head>
            <Page>
                <GuideBox>
                    <GuideImage
                        src="/wrp_demo.gif"
                        alt="青轻阅读用法演示gif"
                    />
                    <Typography
                        gutterBottom
                        sx={{
                            color: 'rgba(0,0,0,0.6)',
                            lineHeight: 2,
                        }}
                    >用法演示gif</Typography>
                </GuideBox>
                <Typography
                    variant='h1'
                    gutterBottom
                    sx={{
                        fontSize: '2em',
                        marginTop: '60px',
                    }}
                >
                    关于青轻阅读（Deep Reading）项目
                </Typography>
                <Typography
                    gutterBottom
                    variant='body1'
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >
                    青轻阅读（<a href="https://github.com/baotlake/deep-reading" target="_blank">
                        Deep Reading
                    </a>）是一个学习英语、阅读英语的工具App，不是给你提供一份最准确的翻译，而是最高效的帮你扫清英语阅读的障碍，从而可以让你可以轻松阅读英语原文。
                </Typography>
                <Typography
                    gutterBottom
                    variant="body1"
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >
                    我(<a href="https://github.com/baotlake" target="_blank">
                        欢洋
                    </a>)
                    从2020年开始构建维护这个项目，累计在其中投入了无数的个人时间和精力。
                    Deep reading给我的学习也提供了不少的便利，我也相信会有更多的人同样喜欢Deep reading。
                </Typography>

                <Typography
                    gutterBottom
                    variant="body1"
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >
                    只是个人的能量总是有限的，Deep Reading在以一种缓慢但顽强的方式成长着。
                    如果你喜欢deep Reading，请支持我们
                </Typography>

                <SupportBox
                    sx={{
                        textAlign: 'center'
                    }}
                >
                    <ButtonGroup>
                        <Button
                            startIcon={<IosShareIcon />}
                            onClick={() => {
                                navigator.share && navigator.share({
                                    url: location.origin,
                                    title: '青轻阅读 Deep Reading'
                                })
                            }}
                        >
                            转发
                        </Button>
                        <Button
                            startIcon={<SvgIcon component={GithubIconSvg} inheritViewBox />}
                            onClick={() => {
                                open('https://github.com/baotlake/deep-reading', '_blank')
                            }}
                        >
                            打星🌟
                        </Button>
                        <Button
                            onClick={() => {
                                setOfficialAccountVisible(!officialAccountVisible)
                            }}
                        >
                            关注公众号
                        </Button>
                    </ButtonGroup>

                    {
                        officialAccountVisible && (
                            <Box
                                sx={{
                                    textAlign: 'center'
                                }}
                            >
                                <Img
                                    src="/qrcode_for_weixin.jpg"
                                    alt="Deep Reading微信公众号二维码"
                                    sx={{
                                        width: '200px',
                                        maxWidth: '80%'
                                    }}
                                />
                                <Box>
                                    <span>{officialAccountName}</span>
                                    <IconButton
                                        onClick={handleCopy}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    }
                </SupportBox>

                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        fontSize: '2em',
                        marginTop: '60px',
                    }}
                >
                    安全提示
                </Typography>

                <Typography
                    gutterBottom
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        lineHeight: 2,
                    }}
                >
                    暂不建议在deep reading打开的其他页面中登录你的个人账号
                </Typography>
            </Page>
        </>
    )
}
