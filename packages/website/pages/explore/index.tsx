import { useEffect, useState, useReducer } from 'react'
import Head from 'next/head'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { exploreData, navigationData } from '../../data'
import { SwipeableView, SwipeView } from '../../components/Explore/SwipeableView'
import { styled } from '@mui/system'
import { ItemCard } from '../../components/Home'
import { apiUrl, contentfulExplore } from '../../utils/contentful'

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

type State = Record<string, any[]>

type Action = {
    type: 'append' | 'cmsInsert'
    payload: State
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'cmsInsert':
            const newState = { ...action.payload }
            for (let key of Object.keys(state)) {
                if (!newState[key]) newState[key] = []
                const oldList = state[key].filter((o) => newState[key].findIndex((n) => n.url == o.url) == -1)
                newState[key].push(...oldList)
                // console.log('newState', key, state[key])
            }
            return newState
        default:
            return { ...state }
    }
}

export default function NewExplore({ active }: { active?: boolean }) {

    const [index, setIndex] = useState(0)
    const [data, dispatch] = useReducer(reducer, exploreData)

    useEffect(() => {
        const hash = window.location.hash.slice(1)
        const hashIndex = navigationData.findIndex(i => i.key == hash)
        if (hashIndex !== -1) setIndex(hashIndex)

        const url = apiUrl('entries', {
            content_type: 'explore',
            limit: '300',
            order: '-fields.rating',
        })

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                // console.log('data', data)
                const list = contentfulExplore(data)
                const insertData: Record<string, any[]> = {}
                list.forEach((i) => {
                    i.tags && i.tags.forEach((t: string) => {
                        if (!insertData[t]) insertData[t] = []
                        insertData[t].push(i)
                    })
                })
                console.log('insertData', insertData)
                dispatch({
                    type: 'cmsInsert',
                    payload: insertData,
                })
            })

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
        <>
            <Head>
                {active !== false && <title>发现 - 青轻阅读 Deep Reading</title>}
            </Head>
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
                            data[previousKey]?.map((item) => (
                                <ItemCard
                                    key={item.url}
                                    url={item.url}
                                    title={item.title}
                                    des={item?.des}
                                    icon={item.icon}
                                />
                            ))
                        }
                    </MySwipeView>
                    <MySwipeView key={currentKey}>
                        {
                            data[currentKey]?.map((item) => (
                                <ItemCard
                                    key={item.url}
                                    url={item.url}
                                    title={item.title}
                                    des={item?.des}
                                    icon={item.icon}
                                />
                            ))
                        }
                    </MySwipeView>
                    <MySwipeView key={nextKey}>
                        {
                            data[nextKey]?.map((item) => (
                                <ItemCard
                                    key={item.url}
                                    url={item.url}
                                    title={item.title}
                                    des={item?.des}
                                    icon={item.icon}
                                />
                            ))
                        }
                    </MySwipeView>
                </SwipeableView>
            </Page>
        </>
    )
}