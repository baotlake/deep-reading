import dynamic from 'next/dynamic'
import PageLoading from '../../components/PageLoading'

import type View from '../../components/View'
type Props = Parameters<typeof View>[0]

const DynamicView = dynamic<Props>(() => import("../../components/View"), {
    ssr: false,
    loading: PageLoading,
})

export default function ReadingPage(props: { active?: boolean }) {
    return (
        <div hidden={props.active === false}>
            <DynamicView
                active={props.active}
            />
        </div>
    )
}
