import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import SvgIcon from '@mui/material/SvgIcon'

import StartSvg from '../../assets/svg/start.svg?svgr'
import ExploreSvg from '../../assets/svg/explore.svg?svgr'
import BookSvg from '../../assets/svg/book.svg?svgr'
import WordSvg from '../../assets/svg/word.svg?svgr'
import AboutSvg from '../../assets/svg/about.svg?svgr'

import { Container } from './index.style'

const path1Regex = /(?:^\/?)(.+?)(?=\/|$|\?|\#)/
const plusHashRegex = /#plus$/
const keepHashRegex = /#keep$/

export default function TrayMenu() {
    const router = useRouter()

    const [current, setCurrent] = useState('home')
    const routeRef = useRef<Record<string, string>>({
        start: '/start',
        explore: '/explore',
        reading: '/reading',
        'reading+': '#plus',
        word: '/word',
        about: '/about'
    })

    const plus = router.asPath.match(plusHashRegex)

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            const found = url.match(path1Regex)
            const keep = url.match(keepHashRegex)
            if (found && found[1] in routeRef.current) {
                setCurrent(found[1])
                if (!keep) routeRef.current[found[1]] = url
            }
        }
        const handleRouteChangeStart = (url: string) => {
            const found = url.match(path1Regex)
            console.log('match url', url, found)
            if (found && found[1] in routeRef.current) {
                setCurrent(found[1])
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
        console.log('handleNavigationChange', router)
        if (value === 'reading+') {
            router.replace({
                pathname: router.pathname,
                query: router.query,
                hash: plus ? '' : 'plus'
            })
            return
        }

        router.replace(routeRef.current[value])
    }

    return (
        <Container>
            <BottomNavigation
                showLabels
                value={current}
                onChange={handleNavigationChange}
                sx={{
                    background: 'none',
                }}
            >
                <BottomNavigationAction
                    label='首页'
                    value="start"
                    icon={<SvgIcon component={StartSvg} inheritViewBox />}
                />
                <BottomNavigationAction
                    label="发现"
                    value="explore"
                    icon={<SvgIcon component={ExploreSvg} inheritViewBox />}
                />

                {current === 'reading' ?
                    <BottomNavigationAction
                        key="reading"
                        sx={{ color: "primary.main" }}
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
                    <BottomNavigationAction
                        key="reading"
                        label="阅读"
                        value="reading"
                        icon={<SvgIcon component={BookSvg} inheritViewBox />}
                    />
                }

                <BottomNavigationAction
                    label="单词"
                    value="word"
                    icon={<SvgIcon component={WordSvg} inheritViewBox />}
                />
                <BottomNavigationAction
                    label="关于"
                    value="about"
                    icon={<SvgIcon component={AboutSvg} inheritViewBox />}
                />
            </BottomNavigation>
        </Container>
    )
}
