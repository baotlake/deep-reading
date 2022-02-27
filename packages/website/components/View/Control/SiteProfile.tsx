/// <reference path="../../../module.d.ts" />

import classNames from 'classnames'
import ButtonBase from '@mui/material/ButtonBase'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import PublicIcon from '@mui/icons-material/Public'


import style from './siteProfile.module.scss'

type Props = {
    loaded: boolean
    loading: boolean
    favicon: string
    title: string
    url: string
}

export function SiteProfile({ loaded, loading, title, url, favicon }: Props) {

    const handleShare = () => {
        const { origin, pathname, search } = location
        const url = origin + pathname + search
        navigator?.share({
            url: url,
            title: 'Deep Reading | ' + title,
            text: '',
        })
    }

    const handleCopy = () => {
        const { origin, pathname, search } = location
        const url = origin + pathname + search
        console.log('copy', url)
        navigator.clipboard.writeText(url)
    }

    return (
        <div
            className={classNames(style['site-profile'])}
        >
            <div className={style['bar']}>
                <Box
                    sx={{
                        width: '100%',
                        minWidth: 0,
                    }}
                >
                    <div className={style['title']}>
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
                        <span>
                            {title}
                        </span>
                    </div>
                    <div className={style['address']}>
                        {url}
                    </div>
                </Box>

                {
                    !loading && <ButtonBase
                        sx={{
                            marginLeft: '15px',
                        }}
                        onClick={handleShare}
                    >
                        <ShareIcon sx={{ fontSize: '1.8rem' }} />
                    </ButtonBase>
                }

                <ButtonBase
                    sx={{
                        marginLeft: '15px'
                    }}
                    onClick={handleCopy}
                >
                    <ContentCopyIcon sx={{ fontSize: '1.8rem' }} />
                </ButtonBase>
            </div>
        </div>
    )
}