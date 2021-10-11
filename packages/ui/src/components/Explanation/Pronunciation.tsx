import {useRef} from 'react'
import {WordData} from '@wrp/core'
import {ButtonBase} from '@mui/material'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

interface Props {
    data: Partial<WordData['pronunciation']>
    overridePlay?: (type: 'am' | 'en' | 'other') => void
}

export default function Pronunciation({data, overridePlay}: Props) {
    const audioUSEl = useRef<HTMLAudioElement>()
    const audioUKEl = useRef<HTMLAudioElement>()
    const audioEl = useRef<HTMLAudioElement>()

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
                <ButtonBase
                    hidden={!data.audio_am} className={"wrp-pronunciation"}
                    onClick={() => play('am')}
                >
                    <span>美</span>
                    <span>{data.symbol_am && `/${data.symbol_en}/`}</span>
                    <VolumeUpRoundedIcon fontSize={'small'}/>
                    {!overridePlay && (
                        <audio
                            ref={audioUSEl}
                            src={data.audio_am}
                            autoPlay={autoPlay[0]}
                        />
                    )}
                </ButtonBase>)
            }

            {data.audio_en && (
                <ButtonBase className={"wrp-pronunciation"}
                            onClick={() => play('en')}
                >
                    <span>英</span>
                    <span>{data.symbol_en && `/${data.symbol_en}/`}</span>
                    <VolumeUpRoundedIcon fontSize={'small'}/>
                    {!overridePlay && (
                        <audio
                            ref={audioUKEl}
                            src={data.audio_en}
                            autoPlay={autoPlay[1]}
                        />
                    )}
                </ButtonBase>)
            }

            {!data.audio_am && !data.audio_en && data.audio_other && (
                <ButtonBase className={"wrp-pronunciation"} onClick={() => play('other')}>
                    <span>
                        {data.symbol_other && `/${data.symbol_other?.replace(
                            'http://res-tts.iciba.com',
                            ''
                        )}/`}
                    </span>
                    <VolumeUpRoundedIcon fontSize={'small'}/>
                    {!overridePlay && (
                        <audio
                            ref={audioEl}
                            src={data.audio_other}
                            autoPlay={autoPlay[2]}
                        />
                    )}
                </ButtonBase>
            )}
        </>
    )
}
