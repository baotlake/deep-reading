import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { readHistory } from '../../utils/history'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ItemCard, GoBar } from '../../components/Home'
import { BlankReadHistory } from '../../components/Blank/BlankReadHistory'

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

type ReadingHistoryItem = Awaited<ReturnType<typeof readHistory['get']>>[0]

const pageKey = '/start'
type Props = {
    keepAliveKey?: string
    recommendedList: ReturnType<typeof contentfulExplore>
}

export default function Start({ keepAliveKey, recommendedList }: Props) {

    const [recentList, setRecentList] = useState<
        Partial<ReadingHistoryItem>[]
    >([])

    useEffect(() => {
        if (keepAliveKey === pageKey) {
            readHistory.getRecent(RECENT_COUNT).then((list) => {
                console.log('list', list)
                setRecentList(list)
            })
        }
    }, [keepAliveKey])

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
                    {recommendedList.map((item, index) => (
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
                            url={item.href || (item as any)?.url}
                            title={item.title || ''}
                            des={item.description || (item as any)?.des}
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


import { apiUrl, contentfulExplore } from '../../utils/contentful'
import type { GetStaticProps } from 'next'
export const getStaticProps: GetStaticProps<Props> = async function (context) {
    const url = apiUrl('entries', {
        content_type: 'explore',
        'fields.tags[in]': 'recommended',
        limit: '4',
        order: '-fields.rating',
    })

    let list: ReturnType<typeof contentfulExplore> = []

    try {
        const res = await fetch(url)
        const data = await res.json()
        list = contentfulExplore(data)
    } catch (error) {
        console.warn(error)
    }

    return {
        props: {
            recommendedList: list,
        },
        // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
        revalidate: 60 * 60 * 24,
    }
}