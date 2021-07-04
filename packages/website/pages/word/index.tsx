import {useEffect, useRef, useState} from 'react'
import {LookUp, WordData} from '@wrp/core'
import {WordItem} from '../../components/Word'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import SortIcon from '@material-ui/icons/Sort'
import { useRouter} from "next/router";

import style from './index.module.scss'

interface Props {
    hidden?: boolean
}

export default function Word({hidden}: Props) {
    let data = useRef({
        mount: false,
        lookUp: LookUp
    })
    let [list, setList] = useState<WordData[]>([])
    const router = useRouter()

    useEffect(() => {
        data.current.mount = true
        data.current.lookUp = new LookUp()

        return () => {
            data.current.mount = false
        }
    }, [])

    useEffect(()=>{

        if(router.route === '/word'){
            data.current.lookUp.geHistory(600).then((list) => {
                if (data.current.mount) {
                    sortList(list)
                }
            })
        }
    }, [router.route])

    const sortList = (list: WordData[], order?: string) => {
        if(!order ) order = 'recent'
        let compareFn = (firstEl: Partial<WordData>, secondEl: Partial<WordData>) => {
            let firstElFirstLetter = firstEl.word.slice(0,1) || '#'
            let secondElFirstLetter = secondEl.word.slice(0,1) || '#'
            switch(order) {
                case 'a-z':
                    return firstElFirstLetter.charCodeAt(0) - secondElFirstLetter.charCodeAt(0)
                case 'z-a':
                    return secondElFirstLetter.charCodeAt(0) - firstElFirstLetter.charCodeAt(0)
                case 'recent':
                    return (secondEl.timestamp || 0) - (firstEl.timestamp || 0)
                case 'earliest':
                    return  (firstEl.timestamp || 0) - (secondEl.timestamp || 0)
                default:
                    return 0
            }
        }
        setList([...list.sort(compareFn)])
    }

    const playAudio = (url: string) => {

    }

    const handleChange = (e: React.ChangeEvent<{value: string}>) => {
        let value = e.target.value
        sortList(list, value)
    }

    return (
        <div className={style['word-page']} hidden={hidden === true}>
            <h2>
                <div className={style['title']}>
                    列表
                </div>
                <Select value={"recent"} onChange={handleChange}>
                    <MenuItem value="a-z">A-Z</MenuItem>
                    <MenuItem value='z-a'>Z-A</MenuItem>
                    <MenuItem value={'recent'}>最近</MenuItem>
                    <MenuItem value={"earliest"}>最早</MenuItem>
                </Select>
                <SortIcon/>
            </h2>
            <div className={style['list']}>
                {list.map((data) => (
                    <WordItem data={data} key={data.word}/>
                ))}
            </div>
        </div>
    )
}
