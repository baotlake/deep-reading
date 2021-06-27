import { useEffect, useState, useRef } from 'react'
import { LookUp, WordData } from '@wrp/core'
import { WordItem } from '../../components/Word'
import style from './index.module.scss'

interface Props {
    hidden?: boolean
}

export default function Word({ hidden }: Props) {
    let data = useRef({
        mount: false,
    })
    let [list, setList] = useState<WordData[]>([])

    useEffect(() => {
        data.current.mount = true
        let lookUp = new LookUp()

        lookUp.geHistory(600).then((list) => {
            if (data.current.mount) {
                setList(list)
            }
        })

        return () => {
            data.current.mount = false
        }
    }, [])

    const playAudio = (url: string) => {
        
    }

    return (
        <div className={style['word-page']} hidden={hidden === true}>
            <h2 className={style['title']}>列表</h2>
            <div className={style['list']}>
                {list.map((data) => (
                    <WordItem data={data} key={data.word} />
                ))}
            </div>
        </div>
    )
}
