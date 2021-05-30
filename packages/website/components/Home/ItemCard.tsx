import React from 'react'
import Link from 'next/link'

import style from './itemCard.module.scss'

export interface ItemCardData {
    url?: string
    key?: string
    icon?: string
    des?: string
    title?: string
}

export default function ItemCard(props: { key?: any; data: ItemCardData }) {
    let data = props.data
    if (!data) data = {}
    return (
        <Link
            href={`/reading?${
                data.url
                    ? 'url=' + encodeURIComponent(data.url)
                    : 'key=' + data.key
            }`}
            data-url={data.url}
            data-key={data.key}
        >
            <div className={style['wrp-card-wrapper']}>
                <div
                    className={`${style['wrp-image-wrapper']} ${style['wrp-card-image']}`}
                >
                    <img
                        className={style['wrp-image']}
                        src={data.icon}
                        alt="Website Logo"
                    />
                </div>
                <div className={style['wrp-card-text-wrapper']}>
                    <div
                        className={`${style['wrp-ellipsis']} ${style['wrp-ct']}`}
                    >
                        {data.title}
                    </div>
                    <div className={style['wrp-cs']}>{data.des}</div>
                </div>
            </div>
        </Link>
    )
}
