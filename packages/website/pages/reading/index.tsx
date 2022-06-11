import dynamic from 'next/dynamic'
import Head from 'next/head'
import PageLoading from '../../components/PageLoading'
import type View from '../../components/View'
type ViewProps = Parameters<typeof View>[0]

const DynamicView = dynamic<ViewProps>(() => import("../../components/View"), {
    ssr: false,
    loading: PageLoading,
})


const pageKey = 'reading'
type Props = {
    keepAliveKey?: string
}

export default function ReadingPage({ keepAliveKey }: Props) {
    return (
        <>
            {
                keepAliveKey === pageKey &&
                <Head>
                    <title>阅读 - 青轻阅读 Deep Reading</title>
                </Head>
            }
            <div hidden={keepAliveKey !== pageKey}>
                <DynamicView
                    active={keepAliveKey === pageKey}
                />
            </div>
        </>
    )
}


import type { GetStaticProps } from 'next'
export const getStaticProps: GetStaticProps = async function (context) {
    return {
        props: {
            keepAliveKey: pageKey,
        }
    }
}