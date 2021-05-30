import React from 'react'

import ItemCard, { ItemCardData } from './ItemCard'


export default function History(props: { data: ItemCardData[] }) {
    let List = [] as any[];
    if (!props.data) return List;
    for (let i of props.data) {
        List.unshift(
            <ItemCard
                key={i.url || i.key || i.des}
                data={i}
            ></ItemCard>
        )
    }
    return List;
}