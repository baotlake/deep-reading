import Link from 'next/link'
import { A, Title, ImageWrapper, Description } from './ItemCard.style'

const imgFallback = '/logo_fallback.svg'

type Props = {
    url: string
    title: string
    des?: string
    icon?: string
}

export default function ItemCard({ url, title, des, icon }: Props) {
    return (
        <Link
            href={'/reading?url=' + encodeURIComponent(url + '')}
            data-url={url}
        >
            <A
                href={url}
            >
                <Title>
                    {title}
                </Title>
                <ImageWrapper>
                    <img
                        decoding="async"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        src={icon || imgFallback}
                        data-fallback={imgFallback}
                        alt="favicon"
                    />
                </ImageWrapper>
                <Description>
                    {des}
                </Description>
            </A>
        </Link>
    )
}
