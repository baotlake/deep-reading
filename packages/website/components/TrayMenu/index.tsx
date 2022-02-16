import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { about, explore, home, reading, word } from './icons'

import style from './trayBar.module.scss'

const path1Regex = /(?<=(\/\/.+?\/)|^\/).+?(?=\/|$|\?|\#)/
const plusHashRegex = /#plus$/

export default function TrayMenu() {
    const router = useRouter()

    const [current, setCurrent] = useState('home')
    const routeRef = useRef<Record<string, string>>({
        home: '/home',
        explore: '/explore',
        reading: '/reading',
        'reading+': '#plus',
        word: '/word',
        about: '/about'
    })

    const plus = router.asPath.match(plusHashRegex)

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


    const handleNavigationChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
        console.log('router', router)
        if (value === 'reading+') {

            router.push({
                pathname: router.pathname,
                query: router.query,
                hash: plus ? '' : 'plus'
            })
            return
        }
        router.push(routeRef.current[value])
    }

    return (
        <div
            className={style['bottom-nav-container']}
        >
            <BottomNavigation
                showLabels
                value={current}
                onChange={handleNavigationChange}
            >
                <BottomNavigationAction label='首页' value="home" icon={home} />
                <BottomNavigationAction label="发现" value="explore" icon={explore} />

                {current === 'reading' ?
                    <BottomNavigationAction
                        sx={{ color: '#1b82fe' }}
                        label=""
                        value="reading+"
                        icon={
                            <AddCircleIcon
                                sx={{ transform: plus ? 'rotate(135deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                                fontSize='large'
                            />
                        }
                    />
                    :
                    <BottomNavigationAction label="阅读" value="reading" icon={reading} />
                }

                <BottomNavigationAction label="单词" value="word" icon={word} />
                <BottomNavigationAction label="关于" value="about" icon={about} />
            </BottomNavigation>
        </div>
    )
}
