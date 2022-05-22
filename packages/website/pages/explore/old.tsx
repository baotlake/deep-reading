import { useEffect, useRef, useState } from 'react'
import { ItemCard } from '../../components/Home'
import { SkeletonItem } from '../../components/Explore/SkeletonItem'
import { exploreData, navigationData } from '../../data'
import NavigationBar from '../../components/Explore/NavigationBar'

import style from './old.module.scss'

export default function Explore(props: { active?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const cutContainerEl = useRef<HTMLDivElement>(null)
    const dataRef = useRef({
        currentIndex: 0
    })
    dataRef.current.currentIndex = currentIndex

    useEffect(() => {
        let hashKey = window.location.hash.slice(1)
        let hashIndex = navigationData.findIndex(item =>
            item.key === hashKey
        )
        if (hashIndex === -1) hashIndex = 0
        setCurrentIndex(hashIndex)
        let count = 0
        let trigger = false
        let start = [0, 0]
        let offset = [0, 0]
        const handleTouchStart = (e: TouchEvent) => {
            start = [e.touches[0].clientX, e.touches[0].clientY]
            count = 1
            trigger = false
        }
        const handleTouchMove = (e: TouchEvent) => {
            let xy = [e.touches[0].clientX, e.touches[0].clientY]
            offset = [xy[0] - start[0], xy[1] - start[1]]
            count++
            if (!cutContainerEl.current) return
            console.log('t', offset, count)
            if (count < 10 && !trigger && Math.abs(offset[0]) > 12 && Math.abs(offset[1]) < 8) {
                return trigger = true
            }
            if (trigger)
                cutContainerEl.current.style.transform = `translateX(${offset[0]}px)`
        }
        const handleTouchEnd = () => {
            let currentIndex = dataRef.current.currentIndex
            if (!cutContainerEl.current) return
            if (!trigger) return
            cutContainerEl.current.style.transition = 'transform 0.3s'

            if (offset[0] > 80 && currentIndex >= 1) {
                cutContainerEl.current.style.transform = 'translateX(100%)'
                setTimeout(() => {
                    setCurrentIndex(currentIndex - 1)
                    if (cutContainerEl.current) {
                        cutContainerEl.current.style.transform = 'translateX(0)'
                        cutContainerEl.current.style.transition = ''
                    }
                }, 300)
                return
            }
            if (offset[0] < -80 && currentIndex < navigationData.length - 1) {
                cutContainerEl.current.style.transform = 'translateX(-100%)'
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1)
                    if (cutContainerEl.current) {
                        cutContainerEl.current.style.transform = 'translateX(0)'
                        cutContainerEl.current.style.transition = ''
                    }
                }, 300)
                return
            }

            cutContainerEl.current.style.transform = 'translateX(0)'
            setTimeout(() => {
                if (cutContainerEl.current) {
                    cutContainerEl.current.style.transform = 'translateX(0)'
                    cutContainerEl.current.style.transition = ''
                }

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

    const selectedKey = navigationData[currentIndex]?.key || navigationData[0].key

    useEffect(() => {
        window.location.hash = selectedKey
    }, [currentIndex])

    return (
        <div className={style['wrp-explore-page']} hidden={props.active === false}>
            <header className={style['header']}>
                <NavigationBar
                    list={navigationData}
                    selected={currentIndex}
                    setIndex={setCurrentIndex}
                ></NavigationBar>
            </header>
            <div ref={cutContainerEl} className={style['cut']}>
                <div className={style['card-container'] + ' ' + style['previous']}>
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
                <div className={style['card-container']}>
                    {exploreData[selectedKey as keyof typeof exploreData].map((item, index) => (
                        <ItemCard
                            key={item.url}
                            url={item.url}
                            title={item.title}
                            des={item?.des}
                            icon={item.icon}
                        />
                    ))}
                </div>
                <div className={style['card-container'] + ' ' + style['next']}>
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
            </div>
        </div>
    )
}
