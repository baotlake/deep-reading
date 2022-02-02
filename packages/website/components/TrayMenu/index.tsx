import { useRouter } from 'next/router'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import { about, explore, home, reading, word } from './icons'

import style from './trayBar.module.scss'

export default function TrayMenu() {
    const router = useRouter()

    const icon = useMemo<{ [index: string]: ReactNode }>(
        () => ({
            home: home,
            explore: explore,
            reading: reading,
            word: word,
            about: about,
        }),
        []
    )

    const trayData = useMemo(() => ([
        {
            icon: 'home',
            title: '首页',
            pathname: '/home',
            pathRe: /^\/home/,
        },
        {
            icon: 'explore',
            title: '发现',
            pathname: '/explore',
            pathRe: /^\/explore/,
        },
        {
            icon: 'reading',
            title: '阅读',
            pathname: '/reading',
            pathRe: /^\/reading/,
        },
        {
            icon: 'word',
            title: '单词',
            pathname: '/word',
            pathRe: /^\/word/,
        },
        {
            icon: 'about',
            title: '关于',
            pathname: '/about',
            pathRe: /^\/about/,
        },
    ]), []
    )

    const [isShow, setIsShow] = useState(true)
    const [current, setCurrent] = useState(0)

    useEffect(function () {
        if (!isShow) setIsShow(true)

        const handleRouteChange = () => {
            console.log('routeChangeComplete')
            let showTray = false
            if (window.location.pathname === '/reading') {
                // setIsShow(false)
            }
            trayData.forEach(({ pathRe }, index) => {
                if (pathRe.test(window.location.pathname)) {
                    setCurrent(index)
                    showTray = true
                }
            })
            setIsShow(showTray)
        }
        handleRouteChange()
        router.events.on('routeChangeComplete', handleRouteChange)
        const handleRouteChangeStart = () => {
            trayData.forEach(({ pathRe }, index) => {
                if (pathRe.test(window.location.pathname)) {
                    trayData[index].pathname =
                        window.location.pathname + window.location.search
                }
            })
        }
        router.events.on('routeChangeStart', handleRouteChangeStart)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
            router.events.off('routeChangeStart', handleRouteChangeStart)
        }
    }, [])

    return (
        <div
            className={`${style['bottom-nav-container']} ${isShow ? '' : style['hidden']
                }`}
        >
            <BottomNavigation
                showLabels
                value={current}
                onChange={(event, newValue) => {
                    router.push(trayData[newValue].pathname)
                    setCurrent(newValue)
                }}
            >
                {
                    trayData.map((item, index) => (
                        <BottomNavigationAction key={index} label={item.title} icon={icon[item.icon]} />
                    ))
                }
            </BottomNavigation>
        </div>
    )
}
