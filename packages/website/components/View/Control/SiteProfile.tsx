/// <reference path="../../../module.d.ts" />

import IconButton from '@mui/material/IconButton'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import PublicIcon from '@mui/icons-material/Public'
import { Address } from './Address'

import { styled } from '@mui/system'

const Wrapper = styled('div')({
    top: 20,
    width: '100%',
    pointerEvents: 'all',
})

const Bar = styled('div')({
    display: 'flex',
    padding: '12px 16px',
    borderRadius: 8,
    background: 'white',
})

const Title = styled('div')({
    display: 'flex',
    fontSize: 18,
    alignItems: 'center',
    minWidth: 0,

    '> span': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    }
})

const Button = styled(IconButton)(({ theme }) => ({
    margin: 'auto',
    flex: 'none',
    '&:hover': {
        color: theme.palette.primary.main,
    }
}))


type Props = {
    loaded: boolean
    loading: boolean
    favicon: string
    title: string
    url: string
    noScript: boolean
    allowSameOrigin: boolean

}

export function SiteProfile({
    loaded,
    loading,
    title,
    url,
    favicon,
    noScript,
    allowSameOrigin,
}: Props) {

    const handleShare = () => {
        const { origin, pathname, search } = location
        const url = origin + pathname + search
        try {
            navigator?.share({
                url: url,
                title: 'Deep Reading | ' + title,
                text: '',
            })
        } catch (error) { }
    }

    const handleCopy = () => {
        const url = new URL(location.href)
        url.searchParams.set('r', 'url')

        const text = url.href
        console.log('copy', text)
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
            return
        }

        // clipboard patch
        const input = document.createElement('input')
        input.value = text
        input.select()
        document.execCommand('copy')
    }

    return (
        <Wrapper>
            <Bar>
                <Box
                    sx={{
                        width: '100%',
                        minWidth: 0,
                    }}
                >
                    <Title>
                        <Box
                            sx={{
                                position: 'relative',
                                width: 20,
                                height: 20,
                                paddingRight: '10px',
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 20,
                                    height: 20,
                                }}
                                src={favicon}
                                variant={(loading || !loaded) ? "circular" : "rounded"}
                            >
                                {!favicon && <PublicIcon />}
                            </Avatar>
                            {
                                (loading || !loaded) && <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: -2,
                                        left: -2,
                                    }}
                                />
                            }
                        </Box>
                        <span>{title}</span>
                    </Title>
                    <Address url={url} noScript={noScript} allowSameOrigin={allowSameOrigin} />
                </Box>
                {
                    !loading && <Button
                        aria-label="分享"
                        disabled={!navigator?.share}
                        size="large"
                        onClick={handleShare}
                    >
                        <ShareIcon sx={{ fontSize: '1.6rem' }} />
                    </Button>
                }
                <Button
                    aria-label="复制链接"
                    size="large"
                    onClick={handleCopy}
                >
                    <ContentCopyIcon sx={{ fontSize: '1.6rem' }} />
                </Button>
            </Bar>
        </Wrapper>
    )
}