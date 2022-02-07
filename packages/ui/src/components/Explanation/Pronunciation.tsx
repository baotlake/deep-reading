import React, { useRef } from 'react'
import { WordData } from '@wrp/core'
import { ButtonBase } from '@mui/material'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import styled from '@emotion/styled'

const Button = styled(ButtonBase)`
    font-size: ${12 / 14 + 'em'};
    display: inline-flex;
    margin-right: ${10 / 12 + 'em'};
    align-items: center;
    height: ${20 / 12 + 'em'};
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    padding: 0 ${5 / 12 + 'em'};
    margin-left: ${-5 / 12 + 'em'};
    border-radius: ${2 / 12 + 'em'};
    outline: none;
    border: none;
    vertical-align: middle;
`

interface Props {
    data: Partial<WordData['pronunciation']>
    overridePlay?: (type: 'am' | 'en' | 'other') => void
}

export default function Pronunciation({ data, overridePlay }: Props) {
    if (!data) data = {}

    const play = (type: 'am' | 'en' | 'other') => {
        if (overridePlay) {
            return overridePlay(type)
        }

        const url = type === 'am' ? data.audio_am : type === 'en' ? data.audio_en : data.audio_other
        const audio = new Audio(url)
        audio.play()
    }

    return (
        <>
            {data.audio_am && (
                <Button
                    hidden={!data.audio_am}
                    onClick={() => play('am')}
                >
                    <span>美</span>
                    <span>{data.symbol_am && `/${data.symbol_en}/`}</span>
                    <VolumeUpRoundedIcon
                        fontSize={'small'}
                        sx={{
                            fontSize: 20 / 12 + 'em',
                        }}
                    />
                </Button>)
            }

            {data.audio_en && (
                <Button
                    onClick={() => play('en')}
                >
                    <span>英</span>
                    <span>{data.symbol_en && `/${data.symbol_en}/`}</span>
                    <VolumeUpRoundedIcon
                        fontSize={'small'}
                        sx={{
                            fontSize: 20 / 12 + 'em',
                        }}
                    />
                </Button>)
            }

            {!data.audio_am && !data.audio_en && data.audio_other && (
                <Button onClick={() => play('other')}>
                    <span>
                        {data.symbol_other && `/${data.symbol_other?.replace(
                            'http://res-tts.iciba.com',
                            ''
                        )}/`}
                    </span>
                    <VolumeUpRoundedIcon
                        fontSize={'small'}
                        sx={{
                            fontSize: 20 / 12 + 'em',
                        }}
                    />
                </Button>
            )}
        </>
    )
}
