import React from 'react'

import ItemCard, { ItemCardData } from './ItemCard'

export default function History(props: { data: ItemCardData[] }): JSX.Element {
    let List: JSX.Element[] = []
    if (!props.data) return <>{List}</>
    for (let i of props.data) {
        List.unshift(
            <ItemCard key={i.href} data={i}></ItemCard>
        )
    }
    return <> {List} </>
}
