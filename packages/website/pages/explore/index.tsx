import { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { exploreData, navigationData } from '../../data'
import { SwipeableView, SwipeView } from '../../components/Explore/SwipeableView'
import { styled } from '@mui/system'
import { ItemCard } from '../../components/Home'
import { cardGridStyle } from '../../styles/card.style'


const Page = styled('div')({
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    boxSizing: 'border-box',
})

const Header = styled('div')({
    position: 'absolute',
    top: 0,
    background: 'rgba(255,255,255,0.8)',
    zIndex: 1,
    backdropFilter: 'blur(10px)',
    maxWidth: '100%',
})

const MySwipeView = styled(SwipeView)({
    ...cardGridStyle(),
    padding: '60px 20px 90px',
    paddingBottom: `calc(env(safe-area-inset-bottom) + 56px + 20px)`
})

export default function NewExplore({ active }: { active?: boolean }) {

    const [index, setIndex] = useState(0)

    useEffect(() => {
        const hash = window.location.hash.slice(1)
        const hashIndex = navigationData.findIndex(i => i.key == hash)
        if (hashIndex !== -1) setIndex(hashIndex)
    }, [])

    const handleTabsChange = (value: string) => {
        setIndex(
            navigationData.findIndex((data) => data.key === value)
        )
    }

    const handleSwipeChange = (n: number) => {
        const newIndex = (navigationData.length + index + n) % navigationData.length
        setIndex(newIndex)
    }

    const previousIndex = (index - 1 + navigationData.length) % navigationData.length
    const nextIndex = (index + 1 + navigationData.length) % navigationData.length

    const previousKey = navigationData[previousIndex]?.key as keyof typeof exploreData
    const currentKey = navigationData[index]?.key as keyof typeof exploreData
    const nextKey = navigationData[nextIndex]?.key as keyof typeof exploreData

    useEffect(() => {
        window.location.hash = currentKey
    }, [currentKey])

    return (
        <Page hidden={active === false}>
            <Header>
                <Tabs
                    value={navigationData[index]?.key}
                    variant="scrollable"
                    scrollButtons
                    onChange={(e, newValue) => handleTabsChange(newValue)}
                >
                    {
                        navigationData.map((data) => (
                            <Tab
                                key={data.key}
                                value={data.key}
                                label={data.title}
                            />
                        ))
                    }
                </Tabs>
            </Header>
            <SwipeableView
                index={index}
                onChange={handleSwipeChange}
                // noCircle
                min={0}
                max={6}
            >
                <MySwipeView key={previousKey}>
                    {
                        exploreData[previousKey]?.list.map((data) => (
                            <ItemCard data={data} key={data.href} />
                        ))
                    }
                </MySwipeView>
                <MySwipeView key={currentKey}>
                    {
                        exploreData[currentKey]?.list.map((data) => (
                            <ItemCard data={data} key={data.href} />
                        ))
                    }
                </MySwipeView>
                <MySwipeView key={nextKey}>
                    {
                        exploreData[nextKey]?.list.map((data) => (
                            <ItemCard data={data} key={data.href} />
                        ))
                    }
                </MySwipeView>
            </SwipeableView>
        </Page>
    )
}