import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { ReadHistory } from '@wrp/core'
import { styled } from '@mui/system'
import { ItemCard, GoBar } from '../../components/Home'
import LogoSvg from '../../assets/logo_name.svg?svgr'
import { cardGridStyle } from '../../styles/card.style'

const Page = styled('div')({
    width: '100%',
    padding: '20px 20px 90px 20px',
    boxSizing: 'border-box',
    position: 'relative',
    borderBottom: `env(safe-area-inset-bottom) solid transparent`,
})

const LogoContainer = styled('div')({
    marginTop: '5em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const StyledLogoSvg = styled(LogoSvg)({
    width: '182px',
    height: '66px',
})

const CardsContainer = styled('div')({
    ...cardGridStyle(),
})


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
        <>
            <Head>
                <title>首页 - 青轻阅读 Deep Reading</title>
            </Head>
            <Page>
                <LogoContainer>
                    <Link href="/">
                        <StyledLogoSvg />
                    </Link>
                </LogoContainer>
                <GoBar />
                <CardsContainer
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
                </CardsContainer>
                <div>{/**推荐文章 */}</div>

            </Page>
        </>
    )
}
