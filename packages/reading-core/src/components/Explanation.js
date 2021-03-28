import React, { useRef } from 'react'

import Switch from './Explanation/Switch'
import More from './Explanation/More'
import Pronunciation from './Explanation/Pronunciation'

// import './explanation.scss';
/* eslint import/no-webpack-loader-syntax: off */
import styles from '!!raw-loader!sass-loader!./explanation.scss';
import switchStyles from '!!raw-loader!sass-loader!./explanation/switch.scss'
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


const answerFormat = answer => {
    // answer = [["n.", "开关"],["vt.", "转变"]]
    if (!answer) return '';
    return answer.map(value => (<dt><b>{value[0]}</b>{value[1]}</dt>))
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

    const nothing = (
        <div className="wrp-ep-other-content">
            <div className="wrp-icon">
                <svg t="1600868218467" viewBox="0 0 1024 1024" width="100%" height="100%"><defs><style type="text/css"></style></defs><path d="M861.140992 694.10816c-3.49184-31.456256-17.475584-48.93184-17.475584-52.427776 0-3.49696-6.987776-3.49696-10.484736-3.49696-3.495936 3.49696-3.495936 6.992896-3.495936 13.980672 0 0 10.488832 17.475584 13.980672 45.44 3.495936 34.952192-6.987776 66.407424-31.456256 97.867776-27.96032 31.456256-69.904384 48.93184-129.324032 48.93184-20.97152 0-41.944064-3.495936-55.923712-3.495936 3.495936 0 3.495936-3.495936 6.991872-3.495936 10.483712-6.987776 17.475584-17.475584 20.967424-31.456256 6.992896-13.979648 10.488832-31.455232 10.488832-52.427776 0-48.93184 13.979648-83.888128 41.944064-101.363712 34.951168-27.96032 87.379968-10.483712 87.379968-10.483712h3.495936c-6.992896 13.979648-10.488832 27.959296-17.476608 38.447104-20.97152 34.952192-38.448128 55.924736-38.448128 59.420672-3.495936 3.49184-3.495936 10.483712 0 13.979648 3.495936 3.495936 10.484736 3.495936 13.980672 0 0 0 20.97152-24.467456 41.944064-59.419648 10.483712-20.972544 20.97152-41.944064 27.959296-62.916608 6.991872-24.46336 13.984768-48.93184 13.984768-73.399296 0-3.492864-3.495936-10.484736-10.488832-10.484736-3.495936 0-10.483712 3.495936-10.483712 10.484736 0 27.963392-6.991872 52.431872-13.983744 76.895232l-3.49184-3.495936s-13.984768-3.49184-34.952192-3.49184c-27.964416 0-48.935936 6.987776-66.412544 17.476608-31.455232 20.97152-45.44 59.419648-48.93184 115.34336 0 31.456256-10.487808 55.923712-27.963392 69.904384-10.484736 10.483712-24.46848 13.979648-24.46848 13.979648-3.49184 0-6.987776 3.495936-6.987776 6.991872 0 3.49184 3.495936 6.9888 6.987776 10.484736 0 0 38.448128 10.487808 83.888128 10.487808 27.964416 0 52.427776-3.495936 73.40032-10.487808 27.963392-10.484736 49.874944-26.417152 66.41152-45.436928C838.996992 797.696 851.456 777.728 856.832 756.992c2.866176-11.057152 7.2192-44.544 4.308992-62.88384z m-69.904384-531.279872c0-3.492864-3.495936-10.484736-6.987776-10.484736-3.495936 0-10.487808 3.495936-10.487808 6.991872-10.483712 59.416576-101.359616 171.264-199.227392 227.188736 3.495936-20.968448 0-41.939968-3.49696-55.924736-10.483712-38.444032-38.447104-66.407424-76.895232-73.399296-48.93184-10.484736-87.379968 10.487808-108.352512 48.935936-17.475584 34.952192-13.979648 73.40032 6.987776 97.867776 31.460352 34.952192 76.896256 41.939968 132.819968 24.464384 6.992896-3.495936 17.476608-6.9888 24.46848-10.484736-10.483712 31.456256-31.456256 66.408448-66.408448 94.372864-115.34336 97.867776-269.135872 118.8352-314.575872 118.8352-3.49184 0-10.483712 3.495936-10.483712 10.488832 0 6.987776 3.495936 10.483712 10.483712 10.483712 48.935936 0 206.220288-20.972544 325.060608-125.828096 45.44-38.448128 66.41152-80.392192 76.895232-118.84032 104.856576-52.427776 209.716224-174.759936 220.199936-244.667392zM553.561088 397.011968c-10.487808 6.991872-24.46848 10.483712-34.952192 13.979648-48.935936 13.980672-87.384064 6.991872-115.34336-20.97152-17.476608-17.476608-17.476608-48.93184-3.495936-76.896256 13.979648-27.96032 41.94304-41.939968 69.90336-41.939968h17.476608c31.459328 6.987776 52.431872 27.96032 62.915584 59.415552 6.991872 20.972544 6.991872 41.944064 3.495936 66.412544z m0 0" fill="#999999" p-id="28413"></path></svg>
            </div>
        </div>
    )

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
                        {explanation.status === 'completed' ? answerFormat(data.answer) : Loading}
                        {(explanation.status === 'completed' && !data.answer) ? nothing : ''}
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