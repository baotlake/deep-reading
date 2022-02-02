import React, { useRef } from 'react'
import { WordData } from '@wrp/core'
import { ButtonBase } from '@mui/material'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import styled from '@emotion/styled'

const Button = styled(ButtonBase)`
    display: inline-flex;
    margin-right: 10px;
    align-items: center;
    font-size: 12px;
    height: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    padding: 0 5px;
    margin-left: -5px;
    border-radius: 2px;
    outline: none;
    border: none;
    vertical-align: middle;
`

interface Props {
    data: Partial<WordData['pronunciation']>
    overridePlay?: (type: 'am' | 'en' | 'other') => void
}

export default function Pronunciation({ data, overridePlay }: Props) {
    const audioUSEl = useRef<HTMLAudioElement>(null)
    const audioUKEl = useRef<HTMLAudioElement>(null)
    const audioEl = useRef<HTMLAudioElement>(null)

    let autoPlay = [false, false, false]
    if (!data) data = {}

    const play = (type: 'am' | 'en' | 'other') => {
        if (overridePlay) {
            return overridePlay(type)
        }
        const audio = {
            am: audioUSEl.current,
            en: audioUKEl.current,
            other: audioEl.current
        }[type]
        audio && audio.play()
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
                            fontSize: 20,
                        }}
                    />
                    {!overridePlay && (
                        <audio
                            ref={audioUSEl}
                            src={data.audio_am}
                            autoPlay={autoPlay[0]}
                        />
                    )}
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
                            fontSize: 20,
                        }}
                    />
                    {!overridePlay && (
                        <audio
                            ref={audioUKEl}
                            src={data.audio_en}
                            autoPlay={autoPlay[1]}
                        />
                    )}
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
                            fontSize: 20,
                        }}
                    />
                    {!overridePlay && (
                        <audio
                            ref={audioEl}
                            src={data.audio_other}
                            autoPlay={autoPlay[2]}
                        />
                    )}
                </Button>
            )}
        </>
    )
}
