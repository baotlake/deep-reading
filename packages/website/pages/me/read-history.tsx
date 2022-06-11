import Head from "next/head"
import Link from "next/link"
import { styled } from "@mui/system"
import { useEffect, useState } from "react"
import { readHistory } from "../../utils/history"
import { ReadHistoryItem } from '../../components/Me/ReadHistoryItem'
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

import { BlankReadHistory } from '../../components/Blank/BlankReadHistory'

const Page = styled('div')({})

const Header = styled('header')(({ theme }) => ({
    color: theme.palette.primary.dark,
}))

type HistoryData = typeof readHistory['data']

export default function () {
    const [list, setList] = useState<HistoryData[]>([])

    useEffect(() => {
        readHistory.get(3000).then((items) => {
            setList(items)
        })
    }, [])

    const removeItem = (key: number) => {
        readHistory.delete(key)
        setList(list.filter((item) => item.key !== key))
    }

    return (
        <>
            <Head>
                <title>阅读历史 - 青轻阅读 Deep Reading</title>
            </Head>
            <Page
                className="max-w-2xl m-auto"
            >
                <Header
                    className="flex items-center py-3 px-5 text-2xl bg-white/75 backdrop-blur-md sticky top-0 z-10"
                >
                    <Link href="/start">
                        <IconButton sx={{color: 'primary.dark'}}>
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </Link>
                    <h1 className="text-2xl font-normal ml-2">
                        阅读历史
                    </h1>

                </Header>
                <Box className="relative">
                    {
                        list.map((data) => (
                            <ReadHistoryItem
                                key={data.key}
                                iconUrl={data.icon}
                                title={data.title}
                                url={data.href}
                                linkHref={'/reading?url=' + encodeURIComponent(data.href)}
                                onDelete={() => removeItem(data.key)}
                            />
                        ))
                    }

                    {
                        list.length <= 0 && (
                            <BlankReadHistory />
                        )
                    }
                </Box>
            </Page>
        </>
    )
}