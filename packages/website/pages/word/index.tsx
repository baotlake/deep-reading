import Head from 'next/head'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Dictionary, WordData } from '@wrp/core'
import { WordItem } from '../../components/Word'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined'
import { BlankWordHistory } from '../../components/Blank/BlankWordHistory'
import { BlankProgress } from '../../components/Blank/BlankProgress'
import { wordSortCompareFn }  from '../../utils'
import {
    Page,
    Header,
    ListContainer,
} from './index.style'

const pageKey = '/word'
type Props = {
    keepAliveKey?: string
}

type Order = 'recent' | 'earliest' | 'a-z' | 'z-a'

export default function Word({ keepAliveKey }: Props) {
    const data = useRef({
        mount: false,
    })
    const lookUp = useRef<Dictionary>()
    const audioRef = useRef<HTMLAudioElement>()
    const [order, setOrder] = useState<Order>('recent')
    const [list, setList] = useState<WordData[] | null>(null)

    const orderedList = useMemo(() => {
        if (!list) return null
        return list.sort(wordSortCompareFn(order))
    }, [order, list])

    useEffect(() => {
        data.current.mount = true
        lookUp.current = new Dictionary()
        audioRef.current = document.createElement('audio')
        return () => {
            data.current.mount = false
        }
    }, [])

    useEffect(() => {
        if (keepAliveKey === pageKey && lookUp.current) {
            lookUp.current.getHistory(2000).then((list) => {
                if (data.current.mount) {
                    setList(list)
                }
            })
        }
    }, [keepAliveKey])

    const playAudio = (url: string) => {
        if (audioRef.current) {
            audioRef.current.src = url
            audioRef.current.play()
        }
    }

    const handleChange = (e: SelectChangeEvent<string>) => {
        const value = e.target.value as Order
        setOrder(value)
    }

    const handleDownload = () => {
        const dict = lookUp.current
        if (dict) {
            dict.getHistory(100000).then((list) => {
                const ordered = list.sort(wordSortCompareFn(order))
                const wordList = ordered.map(i => i?.word || '')
                const text = wordList.join('\n')
                const blob = new Blob([text])
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'deep-reading-words.txt'
                a.click()
            })
        }
    }

    return (
        <>
            {
                keepAliveKey === pageKey &&
                <Head>
                    <title>单词列表 - 青轻阅读 Deep Reading</title>
                </Head>
            }
            <Page hidden={keepAliveKey !== pageKey}>
                <Header>
                    <Typography
                        variant='h1'
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                    >
                        单词列表
                    </Typography>

                    <IconButton
                        size="small"
                        sx={{ margin: '0 auto 0 1em' }}
                        onClick={handleDownload}
                    >
                        <GetAppOutlinedIcon />
                    </IconButton>


                    {/* <SortIcon /> */}
                    <FormControl variant="standard" size="small">
                        <Select
                            autoWidth
                            defaultValue="recent"
                            value={order}
                            sx={{
                                width: '5em',
                            }}
                            onChange={handleChange}
                        >
                            <MenuItem value={'recent'}>最近</MenuItem>
                            <MenuItem value={"earliest"}>最早</MenuItem>
                            <MenuItem value="a-z">A-Z</MenuItem>
                            <MenuItem value='z-a'>Z-A</MenuItem>
                        </Select>
                    </FormControl>
                </Header>
                <ListContainer>
                    {orderedList && orderedList.map((data) => (
                        <WordItem data={data} key={data.word} playAudio={playAudio} />
                    ))}
                </ListContainer>

                {
                    orderedList && orderedList.length === 0 && (
                        <BlankWordHistory />
                    )
                }
                {
                    !orderedList && <BlankProgress />
                }
            </Page>
        </>
    )
}


// import type { GetStaticProps } from 'next'
// export const getStaticProps: GetStaticProps<Props> = async function (context) {
//     return {
//         props: {
//         }
//     }
// }
