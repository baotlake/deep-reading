import React, { useRef } from 'react'
import SpeakerIcon from './SpeakerIcon'

export default function Pronunciation({
    data,
    type,
    auto,
}: {
    type: 'us' | 'uk' | 'tts'
    data: any
    auto: boolean
}) {
    const audioUSEl = useRef<HTMLAudioElement>()
    const audioUKEl = useRef<HTMLAudioElement>()
    const audioEl = useRef<HTMLAudioElement>()

    let autoPlay = autoPlayWho(data, type, auto)

    return (
        <>
            {data.audioUS ? (
                <div
                    className="title-tts"
                    key={data.audioUS}
                    onClick={() => audioUSEl.current.play()}
                >
                    <div className="">美</div>
                    <SpeakerIcon />
                    <audio
                        ref={audioUSEl}
                        src={data.audioUS}
                        autoPlay={autoPlay[0]}
                    ></audio>
                </div>
            ) : (
                ''
            )}
            {data.audioUK ? (
                <div
                    className="title-tts"
                    key={data.audioUK}
                    onClick={() => audioUKEl.current.play()}
                >
                    <div className="">英</div>
                    <SpeakerIcon />
                    <audio
                        ref={audioUKEl}
                        src={data.audioUK}
                        autoPlay={autoPlay[1]}
                    ></audio>
                </div>
            ) : (
                ''
            )}
            {!data.audioUK || (!data.audioUS && data.audio) ? (
                <div
                    className="title-tts"
                    key={data.audio}
                    onClick={() => audioEl.current.play()}
                >
                    <SpeakerIcon />
                    <audio
                        ref={audioEl}
                        src={data.audio}
                        autoPlay={autoPlay[2]}
                    ></audio>
                </div>
            ) : (
                ''
            )}
        </>
    )
}

function autoPlayWho(data, type: string, auto: boolean) {
    let autoPlay = [false, false, false]
    if (auto === false) return autoPlay
    switch (type) {
        case 'us':
            if (data.audioUS) autoPlay[0] = true
            if (data.audioUK) autoPlay[1] = true
            if (data.audio) autoPlay[2] = true
            break
        case 'uk':
            if (data.audioUK) autoPlay[1] = true
            if (data.audioUS) autoPlay[0] = true
            if (data.audio) autoPlay[2] = true
            break
        case 'tts':
            if (data.audio) autoPlay[2] = true
            if (data.audioUS) autoPlay[0] = true
            if (data.audioUK) autoPlay[1] = true
            break
        default:
            if (data.audioUS) {
                autoPlay[0] = true
                break
            }
            if (data.audioUK) {
                autoPlay[1] = true
                break
            }
            if (data.audio) {
                autoPlay[2] = true
                break
            }
    }
    return autoPlay
}
