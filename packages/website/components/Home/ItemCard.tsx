import { SyntheticEvent, MouseEvent } from 'react'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import { A, Title, ImageWrapper, Description } from './ItemCard.style'

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

    const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
        let img = (e.target as HTMLImageElement)
        if (img.dataset.fallback !== 'true') {
            img.dataset.fallback = 'true'
            img.src = imgFallback
        }
    }

    const handleDelete = (e: MouseEvent) => {
        e.preventDefault()
        props.onDelete && data.key && props.onDelete(data.key)
    }

    return (
        <Link
            href={'/reading?url=' + encodeURIComponent(data.href || '')}
            data-url={data.url}
        >
            <A
                href={data.href}
            >
                <Title>
                    {data.title}
                </Title>
                <ImageWrapper>
                    <img
                        decoding={"async"}
                        loading={"lazy"}
                        referrerPolicy={"no-referrer"}
                        src={data.icon || imgFallback}
                        onError={handleError}
                        alt="website logo icon."
                    />
                </ImageWrapper>
                <Description>
                    {data.des || data.description}
                </Description>
                {
                    props.delete && (
                        <IconButton
                            aria-label="delete"
                            size="large"
                            color="warning"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '20px',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.8)',
                            }}
                            onClick={handleDelete}
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    )
                }
            </A>
        </Link>
    )
}
