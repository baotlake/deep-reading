import {useEffect, useState, useRef} from 'react'
import {ItemCard} from '../../components/Home'
import {exploreData} from '../../utils/explore'
import NavigationBar from '../../components/Explore/NavigationBar'
import {Skeleton} from "@material-ui/lab";
import SkeletonItem from './SkeletonItem'
import style from './explore.module.scss'

export default function Explore(props: { hidden: boolean }) {
    const navigationList = [
        {
            title: '推荐',
            key: 'recommended',
            color: '',
        },
        {
            title: '入门级',
            key: 'gettingStarted',
            color: '',
        },
        {
            title: '英语教材',
            key: 'textbook',
            color: '',
        },
        {
            title: '名著小说',
            key: 'classicNovel',
            color: '',
        },
        {
            title: '技术文档',
            key: 'technicalDocuments',
            color: '',
        },
        {
            title: '时事新闻',
            key: 'news',
            color: '',
        },
        {
            title: '政治金融',
            key: 'politicalFinance',
            color: '',
        },
        {
            title: '文史哲',
            key: 'history',
            color: '',
        },
        {
            title: '体育运动',
            key: 'sports',
            color: '',
        },
    ]
    const navigationData = exploreData as { [index: string]: { list: any[] } }

    const [currentIndex, setCurrentIndex] = useState(0)
    const cutContainerEl = useRef<HTMLDivElement>(null)
    const dataRef = useRef({
        currentIndex: 0
    })
    dataRef.current.currentIndex = currentIndex

    useEffect(() => {
        let hashKey = location.hash.slice(1)
        let hashIndex = navigationList.findIndex(item =>
            item.key === hashKey
        )
        if (hashIndex === -1) hashIndex = 0
        setCurrentIndex(hashIndex)
        let start = [0, 0]
        let offset = [0, 0]
        const handleTouchStart = (e: TouchEvent) => {
            start = [e.touches[0].clientX, e.touches[0].clientY]
        }
        const handleTouchMove = (e: TouchEvent) => {
            let xy = [e.touches[0].clientX, e.touches[0].clientY]
            offset = [xy[0] - start[0], xy[1] - start[1]]
            if (!cutContainerEl.current) return
            console.log('t', xy[0] - start[0])
            cutContainerEl.current.style.transform = `translateX(${offset[0]}px)`
        }
        const handleTouchEnd = () => {
            let currentIndex = dataRef.current.currentIndex
            if (!cutContainerEl.current) return
            cutContainerEl.current.style.transition = 'transform 0.3s'

            if (offset[0] > 50 && currentIndex >= 1) {
                cutContainerEl.current.style.transform = 'translateX(100%)'
                setTimeout(() => {
                    setCurrentIndex(currentIndex - 1)
                    if (cutContainerEl.current) {
                        cutContainerEl.current.style.transition = ''
                        cutContainerEl.current.style.transform = 'translateX(0)'
                    }
                }, 300)
                return
            }
            if (offset[0] < -50 && currentIndex < navigationList.length - 1) {
                cutContainerEl.current.style.transform = 'translateX(-100%)'
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1)
                    if (cutContainerEl.current) {
                        cutContainerEl.current.style.transition = ''
                        cutContainerEl.current.style.transform = 'translateX(0)'
                    }
                }, 300)
                return
            }

            cutContainerEl.current.style.transform = 'translateX(0)'
            setTimeout(() => {
                if (cutContainerEl.current)
                    cutContainerEl.current.style.transform = 'translateX(0)'
            }, 300)


        }
        if (cutContainerEl.current) {
            cutContainerEl.current.addEventListener('touchstart', handleTouchStart)
            cutContainerEl.current.addEventListener('touchmove', handleTouchMove)
            cutContainerEl.current.addEventListener('touchend', handleTouchEnd)
        }

        return () => {
            if (cutContainerEl.current) {
                cutContainerEl.current.removeEventListener('touchstart', handleTouchStart)
                cutContainerEl.current.removeEventListener('touchmove', handleTouchMove)
                cutContainerEl.current.removeEventListener('touchend', handleTouchEnd)
            }
        }
    }, [])

    const selectedKey = navigationList[currentIndex]?.key || navigationList[0].key

    useEffect(() => {
        window.location.hash = selectedKey
    }, [currentIndex])

    return (
        <div className={style['wrp-explore-page']} hidden={props.hidden}>
            <header className={style['header']}>
                <NavigationBar
                    list={navigationList}
                    selected={currentIndex}
                    setIndex={setCurrentIndex}
                ></NavigationBar>
            </header>
            <div ref={cutContainerEl} className={style['cut']}>
                <div className={style['card-container'] + ' ' + style['previous']}>
                    <SkeletonItem/>
                    <SkeletonItem/>
                    <SkeletonItem/>
                    <SkeletonItem/>
                </div>
                <div className={style['card-container']}>
                    {navigationData[selectedKey].list.map((item, index) => (
                        <ItemCard data={item} key={item.url}></ItemCard>
                    ))}
                </div>
                <div className={style['card-container'] + ' ' + style['next']}>
                    <SkeletonItem/>
                    <SkeletonItem/>
                    <SkeletonItem/>
                    <SkeletonItem/>
                </div>
            </div>

        </div>
    )
}
