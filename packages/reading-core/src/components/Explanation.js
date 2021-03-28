import React, { useRef } from 'react'

import Switch from './Explanation/Switch'
import More from './Explanation/More'
import Answer from './Explanation/Answer'
import Nothing from './Explanation/Nothing'
import Pronunciation from './Explanation/Pronunciation'

// import './explanation.scss';
/* eslint import/no-webpack-loader-syntax: off */
import styles from '!!raw-loader!sass-loader!./explanation.scss';
import switchStyles from '!!raw-loader!sass-loader!./Explanation/switch.scss'
import { setMore } from '../actions/explanation';

/**
 * 
 * @param {number} size 
 * @param {number} maxNumber 
 * @param {string} text 
 * @returns 
 */
const calcFontSize = (size, maxNumber, text) => {
    /**size:初始字符大小, maxNumber:初始字符大小下可以显示的最大字符, text：当前字符 */
    if (!text) return size;
    if (text.length <= maxNumber) return size;
    return size * maxNumber / text.length;
}

const calcPosition = (coordinate, zoom = 0) => {
    const ew = 17;                  // em explanation width 宽度
    const eh = 8;                   // em explanation height 高度
    const aw = 2.8;                 // em arrow width 三角箭头宽度
    const ah = 2.8;                 // em arrow height 三角箭头高度
    const topDistance = 12;         // em 顶部距离小于topDistance时,expainPanel显示在单词下方
    const wordDistance = 3;         // em expainPanel距离单词的距离
    const edgeDistance = 1;         // em 最小左右边距
    const arrowOverlapping = 0.1;   // 箭头和框的重叠距离
    const remRatioPx = 14;          // 1 rem = 16 px

    let position = {};
    let arrowPosition = {};
    if (!coordinate) return { position, arrowPosition }
    if (typeof (zoom) !== 'number') zoom = 0;
    let x = coordinate.x, y = coordinate.y, clientY = coordinate.clientY;
    let vw = window.innerWidth, vh = window.innerHeight;

    let ratio = remRatioPx + remRatioPx * zoom;

    //纵向位置 Vertical position
    if (clientY >= topDistance * ratio) {
        // expainPanel显示在单词上方
        position.top = `calc(${y}px - ${eh}em - ${wordDistance}em)`;
        // arrowStyle.transform = 'rotate(180deg)'
        arrowPosition.top = `${eh - ah / 2 - arrowOverlapping}em`
    } else {
        // expainPanel显示在单词下方
        position.top = `calc(${y}px + ${wordDistance}em)`;
        arrowPosition.top = `-${ah / 2 - arrowOverlapping}em`;
        // arrowStyle.transform = 'rotate(0deg)';
    }

    // 横向位置 Horizontal position
    if (x >= vw - (ew / 2 + edgeDistance) * ratio) {
        // 单词位置靠右边框
        position.left = `calc(${vw}px - ${ew}em - ${edgeDistance}em)`;
        // 太偏右 调整
        if ((vw - x) < (edgeDistance * ratio + aw / 2 * ratio)) x = vw - (edgeDistance * ratio + aw / 2 * ratio);
        arrowPosition.left = `calc(${x - vw}px + ${ew + edgeDistance - aw / 2}em)`;
    } else if (x <= (ew / 2 + edgeDistance) * ratio) {
        // 单词位置靠左边框
        position.left = `${edgeDistance}em`;
        // 太偏左 调整
        if (x < (edgeDistance * ratio + aw / 2 * ratio)) x = edgeDistance * ratio + aw / 2 * ratio;
        arrowPosition.left = `calc(${x}px - ${edgeDistance + aw / 2}em)`;
    } else {
        // 中间
        position.left = `calc(${x}px - ${ew / 2}em)`;
        arrowPosition.left = `${ew / 2 - aw / 2}em`;
    }

    return { position, arrowPosition };
}

function Explanation({
    explanation,
    setSetting,
    setMoreFold,
    loadWordData,
    setZoom,
    setExplShow
}) {

    const Loading = (
        <div className="wrp-ep-other-content">
            <div className="wrp-icon">
                <div className="wrp-loading-icon">
                    <div /> <div />
                </div>
            </div>
        </div>
    );

    let { position, arrowPosition } = calcPosition(explanation.coordinate, explanation.zoom)
    let data = explanation.data || {}
    let setting = explanation.setting || {}
    let more = explanation.more || [];
    let zoom = { fontSize: `${14 + explanation.zoom}px` }

    return (
        <div
            id="wrp-ep"
            className={`explain-panel ${explanation.show ? '' : 'explain-hidden'}`}
            style={{ ...position, ...zoom }}
            data-wrp-action-block="tapword"
        >
            <style>{styles}</style>
            <style>{switchStyles}</style>
            <div
                className="wrp-ep-arrow-container"
                style={arrowPosition}
            >
                <div className="wrp-ep-arrow"></div>
            </div>
            <div className="wrp-explain-content">
                <div className="wrp-ep-title">
                    <div className="flex">
                        <h3 className="wrp-title-word"
                            style={{ fontSize: `${calcFontSize(1.2, 11, data.word || explanation.word)}em` }}>
                            {data.word || explanation.word}
                        </h3>
                    </div>
                    <div className="flex">
                        <svg
                            className="title-button"
                            style={{ display: 'none' }}
                            fill="var(--t-fore-c)"
                            viewBox="0 0 1024 1024" version="1.1" width="200" height="200" ><defs><style type="text/css"></style></defs><path d="M1009.562 454.103c-72.264 88.023-200.049 233.339-200.049 233.339s20.9 159.55 32.614 268.534c5.09 55.51-34.928 79.513-80.25 57.876-86.242-43.325-217.478-110.448-247-125.573-30.044 14.97-162.6 80.988-249.733 124.211-45.844 21.586-86.343-2.416-81.193-57.825 11.869-108.82 32.983-268.216 32.983-268.216S87.685 541.44 14.582 453.529c-25.836-31.928-9.247-77.311 41.697-85.657 103.885-19.64 264.909-50.944 264.909-50.944s88.074-162.335 143.8-261.755C495.657-5.325 516.874 1.66 520.5 3.441c9.452 3.256 24.371 15.022 43.848 51.783 55.091 99.574 142.172 262.124 142.172 262.124s159.13 31.304 261.806 50.995c50.33 8.397 66.765 53.832 41.237 85.76z" p-id="3336"></path></svg>
                        <svg
                            className={`title-button ${setting.show ? "expl-menu-show" : "expl-menu-hidden"}`}
                            onClick={() => { setSetting({ show: !setting.show }) }}
                            fill="var(--t-fore-c)"
                            viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M415.93 223.79c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.003-95.984-95.984zM415.93 511.742c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.004-95.984-95.984zM415.93 799.866c0-52.98 43.004-95.984 95.984-95.984s95.984 43.003 95.984 95.984-43.004 95.983-95.984 95.983-95.984-43.175-95.984-95.983z" p-id="4126"></path></svg>
                        <div
                            className="title-button close-button"
                            onClick={() => setExplShow(false)}
                        >
                            <div />
                        </div>
                    </div>
                </div>

                <div className="wrp-ep-content">
                    <dl style={explanation.menuBgStyle}>
                        <dt className="flex">
                            <Pronunciation data={data} type={setting.playWhich} auto={setting.autoPlay} />
                        </dt>
                        {explanation.status === 'completed' ? <Answer answer={data.answer} /> : Loading}
                        {(explanation.status === 'completed' && !data.answer) ? <Nothing /> : ''}
                    </dl>
                    <div className={`more-word-contanier ${explanation.unfoldMore ? 'more-unfold' : ''}`}>
                        <More 
                            list={more}
                            isFold={!explanation.unfoldMore}
                            loadWordData={loadWordData}
                            setMoreFold={setMoreFold}
                        />
                    </div>
                    {/* MENU 更多 菜单 */}
                    <div className={`wrp-ep-menu ${setting.show ? "wrp-expl-menu-show" : ""}`} >
                        <div>
                            <span>自动发音</span>
                            <Switch
                                defaultValue={setting.autoPlay !== false}
                                onChange={(status) => setSetting({ autoPlay: status })}
                            ></Switch>
                        </div>
                        <div>
                            <span>美式优先</span>
                            <Switch
                                defaultValue={setting.playWhich ? setting.playWhich === 'us' : true}
                                onChange={(status) => setSetting({ playWhich: status ? 'us' : 'uk' })}
                            ></Switch>
                        </div>
                        <svg className="menu-button" onClick={() => setZoom(1)} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" p-id="2685" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-128 0 0-128c0-19.2-12.8-32-32-32s-32 12.8-32 32l0 128-128 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l128 0 0 128c0 19.2 12.8 32 32 32s32-12.8 32-32l0-128 128 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2686"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2687"></path></svg>
                        <svg className="menu-button" onClick={() => setZoom(-1)} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" p-id="2556" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-320 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l320 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2557"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2558"></path></svg>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Explanation