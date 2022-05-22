import Head from 'next/head'
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from 'react'
import { Dictionary, WordData } from '@wrp/core'
import { WordItem } from '../../components/Word'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
// import FormGroup from '@mui/material/FormGroup'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
// import SortIcon from '@mui/icons-material/Sort'
import { BlankWordHistory } from '../../components/blank/BlankWordHistory'

import {
    Page,
    Header,
    ListContainer,
} from './index.style'

interface Props {
    active?: boolean
}

export default function Word({ active }: Props) {
    const data = useRef({
        mount: false,
        lookUp: Dictionary
    })
    const lookUp = useRef<Dictionary>()
    const audioRef = useRef<HTMLAudioElement>()
    const [list, setList] = useState<WordData[]>([])
    const router = useRouter()

    useEffect(() => {
        data.current.mount = true
        lookUp.current = new Dictionary()
        audioRef.current = document.createElement('audio')
        return () => {
            data.current.mount = false
        }
    }, [])

    useEffect(() => {
        if (router.route === '/word' && lookUp.current) {
            lookUp.current.getHistory(2000).then((list) => {
                if (data.current.mount) {
                    sortList(list)
                }
            })
        }
    }, [router.route])

    const sortList = (list: WordData[], order?: string) => {
        if (!order) order = 'recent'
        let compareFn = (firstEl: Partial<WordData>, secondEl: Partial<WordData>) => {
            let firstElFirstLetter = (firstEl?.word || '#').slice(0, 1)
            let secondElFirstLetter = (secondEl?.word || '#').slice(0, 1)
            switch (order) {
                case 'a-z':
                    return firstElFirstLetter.charCodeAt(0) - secondElFirstLetter.charCodeAt(0)
                case 'z-a':
                    return secondElFirstLetter.charCodeAt(0) - firstElFirstLetter.charCodeAt(0)
                case 'recent':
                    return (secondEl.timestamp || 0) - (firstEl.timestamp || 0)
                case 'earliest':
                    return (firstEl.timestamp || 0) - (secondEl.timestamp || 0)
                default:
                    return 0
            }
        }
        setList([...list.sort(compareFn)])
    }

    const playAudio = (url: string) => {
        if (audioRef.current) {
            audioRef.current.src = url
            audioRef.current.play()
        }
    }

    const handleChange = (e: SelectChangeEvent<string>) => {
        let value = e.target.value
        sortList(list, value)
    }

    return (
        <>
            <Head>
                {
                    active !== false && <title>单词列表 - 青轻阅读 Deep Reading</title>
                }
            </Head>
            <Page hidden={active === false}>
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
                    {/* <SortIcon /> */}
                    <FormControl size="small">
                        <Select
                            autoWidth
                            defaultValue="recent"
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
                    {list.map((data) => (
                        <WordItem data={data} key={data.word} playAudio={playAudio} />
                    ))}
                </ListContainer>

                {
                    list.length === 0 && (
                        <BlankWordHistory />
                    )
                }
            </Page>
        </>
    )
}
