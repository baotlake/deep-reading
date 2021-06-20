import { useRef } from 'react'
import { SpeakerIcon } from '../Svg/Svg'
import { WordData } from '@wrp/core'

interface Props {
    data: Partial<WordData['pronunciation']>
}
export default function Pronunciation({ data }: Props) {
    const audioUSEl = useRef<HTMLAudioElement>()
    const audioUKEl = useRef<HTMLAudioElement>()
    const audioEl = useRef<HTMLAudioElement>()

    let autoPlay = [false, false, false]
    if (!data) data = {}

    return (
        <>
            {data.audio_am && (
                <div
                    role="button"
                    className="wrp-pronuciation"
                    key={1}
                    onClick={() => audioUSEl.current.play()}
                >
                    <span>美</span>
                    <span>/{data.symbol_am}/</span>
                    <SpeakerIcon />
                    <audio
                        ref={audioUSEl}
                        src={data.audio_am}
                        autoPlay={autoPlay[0]}
                    ></audio>
                </div>
            )}
            {data.audio_en && (
                <div
                    role="button"
                    className="wrp-pronuciation"
                    key={2}
                    onClick={() => audioUKEl.current.play()}
                >
                    <span>英</span>
                    <span>/{data.symbol_en}/</span>
                    <SpeakerIcon />
                    <audio
                        ref={audioUKEl}
                        src={data.audio_en}
                        autoPlay={autoPlay[1]}
                    ></audio>
                </div>
            )}
            {!data.audio_am && !data.audio_en && data.audio_other && (
                <div
                    role="button"
                    className="wrp-pronuciation"
                    key={3}
                    onClick={() => audioEl.current.play()}
                >
                    <span>
                        /
                        {data.symobl_other?.replace(
                            'http://res-tts.iciba.com',
                            ''
                        )}
                        /
                    </span>
                    <SpeakerIcon />
                    <audio
                        ref={audioEl}
                        src={data.audio_other}
                        autoPlay={autoPlay[2]}
                    ></audio>
                </div>
            )}
        </>
    )
}
