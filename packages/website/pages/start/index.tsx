import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { readHistory } from '../../utils/history'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ItemCard, GoBar } from '../../components/Home'
import { BlankReadHistory } from '../../components/Blank/BlankReadHistory'
import { apiUrl, contentfulExplore } from '../../utils/contentful'

import LogoSvg from '../../assets/logo_name.svg?svgr'
import { cardGridStyle } from '../../styles/card.style'

const Page = styled('div')({
    width: '100%',
    padding: '20px 20px 90px 20px',
    boxSizing: 'border-box',
    position: 'relative',
    borderBottom: `env(safe-area-inset-bottom) solid transparent`,
})

const LogoContainer = styled('div')({
    marginTop: '5em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const A = styled('a')({})

const StyledLogoSvg = styled(LogoSvg)({
    width: '182px',
    height: '66px',
})

const CardsContainer = styled('div')({
    ...cardGridStyle(),
})

const RECENT_COUNT = 10

type ReadingHistoryItem = typeof readHistory['data']
type ItemCardProps = Parameters<typeof ItemCard>[0]

const pageKey = 'start'
type Props = {
    keepAliveKey?: string
}

export default function Start({ keepAliveKey }: Props) {
    const [recommendedList, setRecommendedList] = useState<ItemCardProps[]>([])

    const [recentList, setRecentList] = useState<
        Partial<ReadingHistoryItem>[]
    >([])

    useEffect(() => {
        readHistory.getRecent(RECENT_COUNT).then((list) => {
            console.log('list', list)
            setRecentList(list)
        })

        const url = apiUrl('entries', {
            content_type: 'explore',
            'fields.tags[in]': 'recommended',
            limit: '3',
            order: '-fields.rating',
        })

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                const list = contentfulExplore(data)
                setRecommendedList(list)
            })
            .catch((error) => {
                console.error(error)
            })

    }, [])

    return (
        <>

            {
                keepAliveKey === pageKey &&
                <Head>
                    <title>首页 - 青轻阅读 Deep Reading</title>
                </Head>
            }
            <Page hidden={keepAliveKey !== pageKey}>
                <LogoContainer>
                    <Link href="/">
                        <a href="/">
                            <StyledLogoSvg />
                        </a>
                    </Link>
                </LogoContainer>
                <GoBar />

                <Box
                    hidden={recommendedList.length == 0}
                    className='mt-5 mb-2 text-xs'
                >
                    <Typography variant='overline'>
                        推荐内容
                    </Typography>
                </Box>
                <CardsContainer hidden={recommendedList.length == 0}>
                    {recommendedList.slice(0, 3).map((item, index) => (
                        <ItemCard
                            key={item.url}
                            url={item.url}
                            title={item.title}
                            des={item.des}
                            icon={item.icon}
                        />
                    ))}
                </CardsContainer>

                <Box className='mt-5 mb-2 text-xs'>
                    <Typography variant='overline'>
                        最近阅读
                    </Typography>
                    <Link href="/me/read-history">
                        <A
                            className='ml-3'
                            href="/me/read-history"
                            sx={{
                                color: 'primary.main',
                            }}
                        >
                            更多
                        </A>
                    </Link>
                </Box>
                <CardsContainer>
                    {recentList.map((item, index) => (
                        <ItemCard
                            key={item.key}
                            url={item.href || item.url}
                            title={item.title}
                            des={item.des || item.description}
                            icon={item.icon}
                        />
                    ))}
                </CardsContainer>
                {
                    recentList.length == RECENT_COUNT && (
                        <Box
                            className='my-3 text-xs text-center'
                        >
                            <Link href="/me/read-history">
                                <A
                                    href="/me/read-history"
                                    sx={{
                                        color: 'primary.main'
                                    }}
                                >查看更多历史</A>
                            </Link>
                        </Box>
                    )
                }

                <Box>
                    {
                        recentList.length <= 0 && (
                            <BlankReadHistory />
                        )
                    }
                </Box>

            </Page>
        </>
    )
}


import type { GetStaticProps } from 'next'
export const getStaticProps: GetStaticProps<Props> = async function (context) {
    return {
        props: {
            keepAliveKey: pageKey,
        }
    }
}