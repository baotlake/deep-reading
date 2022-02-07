import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import { about, explore, home, reading, word } from './icons'

import style from './trayBar.module.scss'

// const path1Regex = /(?<=(\/\/.+?\/)|^\/).+?(?=\/|$|\?|\#)/
const path1Regex = /.+?/

export default function TrayMenu() {
    const router = useRouter()
    const [current, setCurrent] = useState('home')
    const routeRef = useRef<Record<string, string>>({
        home: '/home',
        explore: '/explore',
        reading: '/reading',
        word: '/word',
        about: '/about'
    })

    useEffect(function () {
        const handleRouteChange = (url: string) => {
            const found = url.match(path1Regex)
            if (found && found[0] in routeRef.current) {
                setCurrent(found[0])
                routeRef.current[found[0]] = url
            }
        }
        const handleRouteChangeStart = (url: string) => {
            const found = url.match(path1Regex)
            console.log('match url', url, found)
            if (found && found[0] in routeRef.current) {
                setCurrent(found[0])
                routeRef.current[found[0]] = url
            }
        }
        handleRouteChange(window.location.href.slice(window.location.origin.length))
        router.events.on('routeChangeComplete', handleRouteChange)
        router.events.on('routeChangeStart', handleRouteChangeStart)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
            router.events.off('routeChangeStart', handleRouteChangeStart)
        }
    }, [router])

    return (
        <div
            className={style['bottom-nav-container']}
        >
            <BottomNavigation
                showLabels
                value={current}
                onChange={(event, newValue) => {
                    router.push(routeRef.current[newValue])
                }}
            >
                <BottomNavigationAction label='首页' value="home" icon={home} />
                <BottomNavigationAction label="发现" value="explore" icon={explore} />
                <BottomNavigationAction label="阅读" value="reading" icon={reading} />
                <BottomNavigationAction label="单词" value="word" icon={word} />
                <BottomNavigationAction label="关于" value="about" icon={about} />
            </BottomNavigation>
        </div>
    )
}
