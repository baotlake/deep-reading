
import { styled } from '@mui/system'
import HttpsIcon from '@mui/icons-material/Https'
import CodeIcon from '@mui/icons-material/Code'
import CodeOffIcon from '@mui/icons-material/CodeOff'
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined'
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined'
import { alpha } from '@mui/material'
import { grey, purple } from '@mui/material/colors'
import classNames from 'classnames'


const Wrapper = styled('div')({
    fontSize: 14,
    marginTop: 0,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1.5,
})

const Span = styled('span')({
    userSelect: 'all',
    minWidth: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
    paddingRight: '0.5em',

    'strong': {
        fontWeight: 'inherit',
    },
    'span': {
        opacity: 0.5,
    }
})

const Tag = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    // margin: '0 8px 0 1em',
    margin: '0 0.2em',
    justifyContent: 'space-evenly',
    background: alpha(theme.palette.primary.main, 0.2),
    lineHeight: '1.2em',
    borderRadius: '0.6em',
    padding: '0.1em 0.3em',

    '&.alert': {
        color: purple[700],
        background: alpha(purple[700], 0.2),
    },

    '&.grey': {
        color: grey[700],
        background: alpha(grey[700], 0.2),
    },

    '> svg': {
        display: 'block',
        margin: '0 0.2em',
    }
}))

type Props = {
    url: string
    allowScript: boolean
    allowSameOrigin: boolean
    readerMode: boolean
}

export function Address({ url, allowScript, allowSameOrigin, readerMode }: Props) {
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
                        margin: '0 0.5em 0 -0.1em'
                    }}
                    fontSize='inherit'
                />
            }
            <Span>
                <strong>{highlight}</strong>
                <span>{other}</span>
            </Span>

            {
                readerMode && (
                    <Tag>
                        <ChromeReaderModeOutlinedIcon fontSize='inherit' />
                    </Tag>
                )
            }

            <Tag
                className={classNames({
                    grey: !allowScript,
                })}
            >
                {
                    allowScript ? (
                        <CodeIcon fontSize='inherit' />
                    ) : (
                        <CodeOffIcon fontSize='inherit' />
                    )
                }
            </Tag>

            {
                allowSameOrigin && (
                    <Tag className='alert'>
                        <CookieOutlinedIcon fontSize='inherit' />
                    </Tag>
                )
            }

        </Wrapper>
    )
}