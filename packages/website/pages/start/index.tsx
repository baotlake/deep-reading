import { useState, useRef, ChangeEvent, useEffect } from 'react'
// import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReadHistory } from '@wrp/core'
import { ItemCard, GoBar } from '../../components/Home'

import style from './index.module.scss'


type ReadingHistoryItem = InstanceType<typeof ReadHistory>['data']

export default function Start() {

    const router = useRouter()
    const readHistoryRef = useRef(new ReadHistory())
    const [deleteMode, setDeleteMode] = useState(false)

    const [historyList, setHistoryList] = useState<
        Partial<ReadingHistoryItem>[]
    >([])

    useEffect(() => {
        const readHistory = readHistoryRef.current
        readHistory.get(200).then((list) => {
            console.log('list', list)
            setHistoryList(list)
        })
    }, [])

    useEffect(() => {
        return () => {
            if (deleteMode) {
                setDeleteMode(false)
            }
        }
    }, [router.route])

    const handleDelete = (key: number) => {
        readHistoryRef.current?.delete(key)
        setHistoryList(historyList.filter(item => item.key !== key))
    }

    return (
        <div className={style['home-page']}>
            <div className={style['logo-container']}>
                <div className={style['logo-image-wrapper']}>
                    <img
                        width={80}
                        height={80}
                        // priority={true}
                        src="/logo.png"
                        // layout="fill"
                        alt="Deep Reading Logo."
                    />
                </div>

                <h1
                    className={style['logo-name']}
                    style={{ display: 'none' }}
                >
                    Deep Reading
                </h1>
            </div>
            <GoBar />
            <div
                className={style['card-container']}
                onContextMenu={(e) => {
                    e.preventDefault()
                    setDeleteMode(!deleteMode)
                }}
            >
                {historyList.map((item, index) => (
                    <ItemCard
                        key={item.key}
                        data={item}
                        delete={deleteMode}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            <div>{/**推荐文章 */}</div>

        </div>
    )
}
