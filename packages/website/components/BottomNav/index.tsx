import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import { BottomNavigation, BottomNavigationAction } from "@mui/material"

import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'

import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'

import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined'
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded'

import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'

import { Container } from './index.style'

const path1Regex = /(?:^\/?)(.+?)(?=\/|$|\?|\#)/
const plusHashRegex = /#plus$/
const keepHashRegex = /#keep$/

export default function BottomNav() {
    const router = useRouter()
    const [current, setCurrent] = useState('home')
    const [visible, setVisible] = useState(true)
    const pathRef = useRef<Record<string, string>>({
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
            if (found && found[1] in pathRef.current) {
                setCurrent(found[1])
                if (!keep) pathRef.current[found[1]] = url
            } else {
                setVisible(false)
            }
        }
        const handleRouteChangeStart = (url: string) => {
            const found = url.match(path1Regex)
            console.log('match url', url, found)
            if (found && found[1] in pathRef.current) {
                setCurrent(found[1])
                setVisible(true)
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

        router.replace(pathRef.current[value])
    }

    return (
        <Container className={classNames({ hidden: !visible })}>
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
                    icon={current == 'start' ? <HomeRoundedIcon /> : <HomeOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="发现"
                    value="explore"
                    icon={current == 'explore' ? <ExploreRoundedIcon /> : <ExploreOutlinedIcon />}
                />

                {current === 'reading' ?
                    <BottomNavigationAction
                        key="reading+"
                        sx={{ color: "primary.main" }}
                        // label="阅读"
                        value="reading+"
                        icon={
                            plus ?
                                <AddCircleIcon
                                    sx={{ transform: plus ? 'rotate(135deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                                    fontSize='large'
                                />
                                : <AddCircleOutlineOutlinedIcon fontSize='large' />
                        }
                    />
                    :
                    <BottomNavigationAction
                        key="reading"
                        label="阅读"
                        value="reading"
                        icon={<LocalLibraryOutlinedIcon />}
                    />
                }

                <BottomNavigationAction
                    label="单词"
                    value="word"
                    icon={current == 'word' ? <BookmarkOutlinedIcon /> : <BookmarkBorderOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="关于"
                    value="about"
                    icon={current == 'about' ? <InfoRoundedIcon /> : <InfoOutlinedIcon />}
                />
            </BottomNavigation>
        </Container>
    )
}
