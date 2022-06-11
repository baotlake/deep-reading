import Link from 'next/link'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'

const Item = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
})

const A = styled('a')({})

const Icon = styled('picture')({
    transform: `translateY(-50%)`,
})

type Props = {
    iconUrl?: string
    title?: string
    url?: string
    linkHref: string
    onDelete?: () => void
}

export function ReadHistoryItem({ iconUrl, title, url, linkHref, onDelete }: Props) {

    return (
        <Item
            className='w-full p-3.5 flex'
        >
            <Link href={linkHref}>
                <A
                    className='relative w-full min-w-0 pl-14'
                    href={url}
                >
                    <Box
                        className='text-base truncate'
                    >
                        {title}
                    </Box>
                    <Box
                        className='text-sm truncate'
                    >
                        {url?.replace(/^https?:\/\//, '')}
                    </Box>
                    <Icon
                        className='absolute w-9 h-9 p-2.5 rounded-full left-1.5 top-1/2'
                        sx={{
                            background: 'whitesmoke',
                        }}
                    >
                        <img
                            className='w-full h-full'
                            src={iconUrl}
                            decoding="async"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            data-fallback='/logo_fallback.svg'
                            alt='favicon'
                        />
                    </Icon>
                </A>
            </Link>
            <IconButton
                className="ml-2.5"
                onClick={onDelete}
            >
                <HighlightOffOutlinedIcon />
            </IconButton>
        </Item>
    )
}