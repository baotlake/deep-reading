/// <reference path="../../../module.d.ts" />

import { styled } from '@mui/system'
import IconButton from '@mui/material/IconButton'
import classNames from 'classnames'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import { Address } from './Address'

import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'


const Wrapper = styled('div')({
    top: 20,
    width: '100%',
    pointerEvents: 'all',
})

const Icon = styled('img')({})

const Bar = styled('div')({
    display: 'flex',
    padding: '6px 16px 10px',
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
        width: '100%',
    }
})

const Button = styled(IconButton)(({ theme }) => ({
    margin: '-3px 0',
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
    allowScript: boolean
    allowSameOrigin: boolean
    readerMode: boolean
}

export function SiteProfile({
    loaded,
    loading,
    title,
    url,
    favicon,
    allowScript,
    allowSameOrigin,
    readerMode,
}: Props) {

    const [copySuccess, setCopySuceess] = useState(false)

    const handleShare = () => {
        const { origin, pathname, search } = location
        const url = origin + pathname + search
        const canShare = navigator?.canShare()

        canShare && navigator.share({
            url: url,
            title: 'Deep Reading | ' + title,
            text: '',
        })

        if (!canShare) {
            handleCopy()
            setCopySuceess(true)
        }
    }

    const handleCopy = () => {
        const url = new URL(location.href)
        url.searchParams.set('r', 'url')
        url.hash = ''
        const text = url.href
        console.log('copy', text, url)
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
                            className='mr-3 flex-none'
                            sx={{
                                position: 'relative',
                                width: 20,
                                height: 20,
                            }}
                        >
                            <Icon
                                className={classNames('w-full h-full',
                                    {
                                        rounded: !(loading || !loaded),
                                        'rounded-full': loading || !loaded
                                    }
                                )}
                                src={favicon}
                                data-fallback="/logo_fallback.svg"
                            />
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
                        <Button
                            aria-label="分享"
                            size="medium"
                            onClick={handleShare}
                            sx={{
                                marginRight: '-8px',
                            }}
                        >
                            <IosShareOutlinedIcon sx={{ fontSize: 'inherit' }} />
                        </Button>
                    </Title>
                    <Address
                        url={url}
                        allowScript={allowScript}
                        allowSameOrigin={allowSameOrigin}
                        readerMode={readerMode}
                    />
                </Box>
            </Bar>
            <Snackbar
                open={copySuccess}
                autoHideDuration={300}
                onClose={() => setCopySuceess(false)}
                message="已复制链接"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    margin: '3.5em 1.5em 0',
                }}
            />
        </Wrapper>
    )
}