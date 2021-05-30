import { useState, useRef } from 'react'

import Switch from './Switch'
import More from './More'
import Answer from './Answer'
import Nothing from './Nothing'
import Pronunciation from './Pronunciation'
import Loading from './Loading'

// import './explanation.scss';
/* eslint import/no-webpack-loader-syntax: off */
import styles from '!!raw-loader!sass-loader!./explanation.scss'
// import styles from './explanation.scss?raw'

import switchStyles from '!!raw-loader!sass-loader!./switch.scss'
// import switchStyles from './switch.scss?raw'

import { calcFontSize, positionStyle } from './tool'

export default function Explanation({
    visible,
    explanation,
    position,
    zoom,
    onClose,
}: {
    visible: boolean
    explanation: any
    position: [number, number]
    zoom?: number
    onClose?: () => void
}) {
    zoom = zoom || 1

    const [moreCollapsed, setMoreCollapsed] = useState(true)
    const [showSetting, setShowSetting] = useState(false)

    let [boxStyle, arrowStyle] = positionStyle(position, zoom)

    let data = explanation.data || {}
    let setting = explanation.setting || {}
    let more = explanation.more || []
    let zoomStyle = { fontSize: `${14 + zoom}px` }

    const loadWordData = () => {}
    const setSetting = (value: any) => {}
    const setZoom = (zoom: number) => {}

    return (
        <div
            id="wrp-ep"
            className={`explain-panel ${visible ? '' : 'explain-hidden'}`}
            style={{ ...boxStyle, ...zoomStyle }}
            data-wrp-action-block="tapword"
        >
            <style>{styles}</style>
            <style>{switchStyles}</style>
            <div className="wrp-ep-arrow-container" style={arrowStyle}>
                <div className="wrp-ep-arrow"></div>
            </div>
            <div className="wrp-explain-content">
                <div className="wrp-ep-title">
                    <div className="flex">
                        <h3
                            className="wrp-title-word"
                            style={{
                                fontSize: `${calcFontSize(
                                    1.2,
                                    11,
                                    data.word || explanation.word
                                )}em`,
                            }}
                        >
                            {data.word || explanation.word}
                        </h3>
                    </div>
                    <div className="flex">
                        <svg
                            className="title-button"
                            style={{ display: 'none' }}
                            fill="var(--t-fore-c)"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            width="200"
                            height="200"
                        >
                            <defs>
                                <style type="text/css"></style>
                            </defs>
                            <path
                                d="M1009.562 454.103c-72.264 88.023-200.049 233.339-200.049 233.339s20.9 159.55 32.614 268.534c5.09 55.51-34.928 79.513-80.25 57.876-86.242-43.325-217.478-110.448-247-125.573-30.044 14.97-162.6 80.988-249.733 124.211-45.844 21.586-86.343-2.416-81.193-57.825 11.869-108.82 32.983-268.216 32.983-268.216S87.685 541.44 14.582 453.529c-25.836-31.928-9.247-77.311 41.697-85.657 103.885-19.64 264.909-50.944 264.909-50.944s88.074-162.335 143.8-261.755C495.657-5.325 516.874 1.66 520.5 3.441c9.452 3.256 24.371 15.022 43.848 51.783 55.091 99.574 142.172 262.124 142.172 262.124s159.13 31.304 261.806 50.995c50.33 8.397 66.765 53.832 41.237 85.76z"
                                p-id="3336"
                            ></path>
                        </svg>
                        <svg
                            className={`title-button ${
                                showSetting
                                    ? 'expl-menu-show'
                                    : 'expl-menu-hidden'
                            }`}
                            onClick={() => {
                                setShowSetting(!showSetting)
                            }}
                            fill="var(--t-fore-c)"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            width="200"
                            height="200"
                        >
                            <defs>
                                <style type="text/css"></style>
                            </defs>
                            <path
                                d="M415.93 223.79c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.003-95.984-95.984zM415.93 511.742c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.004-95.984-95.984zM415.93 799.866c0-52.98 43.004-95.984 95.984-95.984s95.984 43.003 95.984 95.984-43.004 95.983-95.984 95.983-95.984-43.175-95.984-95.983z"
                                p-id="4126"
                            ></path>
                        </svg>
                        <div
                            className="title-button close-button"
                            onClick={onClose}
                        >
                            <div />
                        </div>
                    </div>
                </div>

                <div className="wrp-ep-content">
                    <dl style={explanation.menuBgStyle}>
                        <dt className="flex">
                            <Pronunciation
                                data={data}
                                type={setting.playWhich}
                                auto={setting.autoPlay}
                            />
                        </dt>
                        <Answer answer={data.answer} />

                        {/* {explanation.status === 'completed' ? (
                            <Answer answer={data.answer} />
                        ) : (
                            <Loading />
                        )} */}

                        {explanation.status === 'completed' && !data.answer ? (
                            <Nothing />
                        ) : (
                            ''
                        )}
                    </dl>
                    <div
                        className={`more-word-contanier ${
                            moreCollapsed ? 'more-unfold' : ''
                        }`}
                    >
                        <More
                            list={more}
                            collapsed={moreCollapsed}
                            loadWordData={loadWordData}
                            setCollapsed={setMoreCollapsed}
                        />
                    </div>
                    {/* MENU 更多 菜单 */}
                    <div
                        className={`wrp-ep-menu ${
                            showSetting ? 'wrp-expl-menu-show' : ''
                        }`}
                    >
                        <div>
                            <span>自动发音</span>
                            <Switch
                                defaultValue={setting.autoPlay !== false}
                                onChange={(status) =>
                                    setSetting({ autoPlay: status })
                                }
                            ></Switch>
                        </div>
                        <div>
                            <span>美式优先</span>
                            <Switch
                                defaultValue={
                                    setting.playWhich
                                        ? setting.playWhich === 'us'
                                        : true
                                }
                                onChange={(status) =>
                                    setSetting({
                                        playWhich: status ? 'us' : 'uk',
                                    })
                                }
                            ></Switch>
                        </div>
                        <svg
                            className="menu-button"
                            onClick={() => setZoom(1)}
                            fill="var(--t-fore-c)"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            p-id="2685"
                            width="200"
                            height="200"
                        >
                            <defs>
                                <style type="text/css"></style>
                            </defs>
                            <path
                                d="M592 400l-128 0 0-128c0-19.2-12.8-32-32-32s-32 12.8-32 32l0 128-128 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l128 0 0 128c0 19.2 12.8 32 32 32s32-12.8 32-32l0-128 128 0c19.2 0 32-12.8 32-32S611.2 400 592 400z"
                                p-id="2686"
                            ></path>
                            <path
                                d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z"
                                p-id="2687"
                            ></path>
                        </svg>
                        <svg
                            className="menu-button"
                            onClick={() => setZoom(-1)}
                            fill="var(--t-fore-c)"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            p-id="2556"
                            width="200"
                            height="200"
                        >
                            <defs>
                                <style type="text/css"></style>
                            </defs>
                            <path
                                d="M592 400l-320 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l320 0c19.2 0 32-12.8 32-32S611.2 400 592 400z"
                                p-id="2557"
                            ></path>
                            <path
                                d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z"
                                p-id="2558"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
