import dynamic from 'next/dynamic'
import Head from 'next/head'
import PageLoading from '../../components/PageLoading'

import type View from '../../components/View'
type Props = Parameters<typeof View>[0]

const DynamicView = dynamic<Props>(() => import("../../components/View"), {
    ssr: false,
    loading: PageLoading,
})

export default function ReadingPage({ active }: { active?: boolean }) {
    return (
        <>
            <Head>
                {
                    active !== false && <title>阅读 - 青轻阅读 Deep Reading</title>
                }
            </Head>
            <div hidden={active === false}>
                <DynamicView
                    active={active}
                />
            </div>
        </>
    )
}
