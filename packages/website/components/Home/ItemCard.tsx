import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './itemCard.module.scss'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import { Wrapper } from './ItemCard.style'

const imgFallback = '/logo_gray.png'

export interface ItemCardData {
    url?: string
    href?: string
    icon?: string
    des?: string
    description?: string
    title?: string
    key?: number
}

type Props = {
    data: ItemCardData
    delete?: boolean
    onDelete?: (key: number) => void
}

export default function ItemCard(props: Props) {
    let data = props.data
    if (!data) data = {}

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        let img = (e.target as HTMLImageElement)
        if (img.dataset.fallback !== 'true') {
            img.dataset.fallback = 'true'
            img.src = imgFallback
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        props.onDelete && data.key && props.onDelete(data.key)
    }

    return (
        <Link
            href={'/reading?url=' + encodeURIComponent(data.href || '')}
            data-url={data.url}
        >
            <Wrapper className={style['wrp-card-wrapper']}>
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
                {
                    props.delete && (
                        <IconButton
                            className={style['delete']}
                            onClick={handleDelete}
                            aria-label="delete" size="large"
                            color="warning"
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    )
                }
            </Wrapper>
        </Link>
    )
}
