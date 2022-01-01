import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './itemCard.module.scss'

const imgFallback = '/logo_gray.png'

export interface ItemCardData {
    url?: string
    href?: string
    icon?: string
    des?: string
    description?: string
    title?: string
}

export default function ItemCard(props: { data: ItemCardData }) {
    let data = props.data
    if (!data) data = {}

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        let img = (e.target as HTMLImageElement)
        if (img.dataset.fallback !== 'true') {
            img.dataset.fallback = 'true'
            img.src = imgFallback
        }
    }
    return (
        <Link
            href={'/reading?url=' + encodeURIComponent(data.href || '')}
            data-url={data.url}
        >
            <div className={style['wrp-card-wrapper']}>
                <div
                    className={`${style['ellipsis']} ${style['title']}`}
                >
                    {data.title}
                </div>
                <div
                    className={`${style['image-wrapper']}`}
                >
                    <img
                        decoding={"async"}
                        loading={"lazy"}
                        referrerPolicy={"no-referrer"}
                        className={style['image']}
                        src={data.icon || imgFallback}
                        onError={handleError}
                        alt="website logo icon."
                    />
                </div>
                <div className={style['description']}>
                    {data.des || data.description}
                </div>
            </div>
        </Link>
    )
}
