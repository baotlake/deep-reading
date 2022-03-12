import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ReadHistory } from '@wrp/core'
import { ItemCard, GoBar } from '../../components/Home'
import LogoSvg from '../../assets/svg/logo.svg?svgr'

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
                    <LogoSvg width={83} height={64} />
                </div>
                <div className={style['title']}>
                    <h3 className={style['name']}>Deep Reading</h3>
                    <div className={style['des']}>点读，无障碍阅读英文</div>
                </div>
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
