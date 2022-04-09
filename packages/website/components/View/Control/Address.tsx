
import { styled } from '@mui/system'
import HttpsIcon from '@mui/icons-material/Https'
import CodeIcon from '@mui/icons-material/Code'
import CodeOffIcon from '@mui/icons-material/CodeOff'
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined'
import { alpha } from '@mui/material'
import classNames from 'classnames'

type Props = {
    url: string
    noScript: boolean
    allowSameOrigin: boolean
}

const Wrapper = styled('div')({
    fontSize: 14,
    marginTop: 8,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
})

const Span = styled('span')({
    userSelect: 'all',
    minWidth: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',

    'strong': {
        fontWeight: 'inherit',
    },
    'span': {
        opacity: 0.5,
    }
})

const OptionsTag = styled('span')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    marginLeft: '1em',
    justifyContent: 'space-evenly',
    background: alpha(theme.palette.primary.main, 0.2),
    lineHeight: '1.2em',
    borderRadius: '0.6em',
    padding: '0 0.2em',

    '&.alert': {
        background: alpha(theme.palette.error.main, 0.2),
    },

    '> svg': {
        margin: '0 0.2em',
    }
}))

export function Address({ url, noScript, allowSameOrigin }: Props) {
    const httpUrl = /https?:\/\//.test(url)
    const urlObj = httpUrl && new URL(url)

    const https = urlObj && urlObj.protocol === 'https:'

    const highlight = urlObj ? urlObj.hostname : url
    const other = urlObj ? urlObj.href.slice(urlObj.origin.length) : ''

    return (
        <Wrapper>
            {
                https && <HttpsIcon
                    sx={{
                        color: 'primary.main',
                        margin: '0 0.3em 0 -0.1em'
                    }}
                    fontSize='inherit'
                />
            }
            <Span>
                <strong>{highlight}</strong>
                <span>{other}</span>
            </Span>

            <OptionsTag
                className={classNames({
                    alert: !noScript,
                })}
            >
                {
                    noScript ? (
                        <CodeOffIcon
                            fontSize='inherit'
                        />
                    ) : (
                        <CodeIcon
                            fontSize='inherit'
                            sx={{
                                fontSize: '0.85em',
                                color: 'error.main'
                            }}
                        />
                    )
                }

                {
                    allowSameOrigin ? (
                        <CookieOutlinedIcon
                            fontSize='inherit'
                            sx={{
                                fontSize: '0.85em',
                                color: 'error.main'
                            }}
                        />
                    ) : ''
                }
            </OptionsTag>
        </Wrapper>
    )
}