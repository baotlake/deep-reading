import React from 'react'

import Switch from './switch.js';

import './explanation.css';

import arrow_icon from "./res/explainBoxArrow.svg";
import audio_icon from "./res/audio.svg";
import star_icon from "./res/star.svg";
import menu_icon from "./res/more.svg";
import open_icon from './res/open.svg';
import arrowShadow_icon from './res/arrowShadow.png'

const calcFontSize = (size,maxNumber,text) => {
    /**size:初始字符大小, maxNumber:初始字符大小下可以显示的最大字符, text：当前字符 */
    if(!text) return size;
    if(text.length <= maxNumber) return size;
    return size*maxNumber/text.length;
}

const calcPosition = (coordinate, zoom=0) => {
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
    if(!coordinate) return { position, arrowPosition }
    if(typeof(zoom) !== 'number') zoom = 0;
    let x = coordinate.x, y= coordinate.y, clientY = coordinate.clientY;
    let vw = window.innerWidth, vh= window.innerHeight;

    let ratio = remRatioPx + remRatioPx * zoom;

    //纵向位置 Vertical position
    if(clientY >= topDistance * ratio){
        // expainPanel显示在单词上方
        position.top = `calc(${y}px - ${eh}em - ${wordDistance}em)`;
        // arrowStyle.transform = 'rotate(180deg)'
        arrowPosition.top = `${eh - ah / 2 - arrowOverlapping}em`
    }else{
        // expainPanel显示在单词下方
        position.top = `calc(${y}px + ${wordDistance}em)`;
        arrowPosition.top = `-${ah / 2 - arrowOverlapping}em`;
        // arrowStyle.transform = 'rotate(0deg)';
    }

    // 横向位置 Horizontal position
    if(x >= vw - (ew / 2 + edgeDistance) * ratio){
        // 单词位置靠右边框
        position.left = `calc(${vw}px - ${ew}em - ${edgeDistance}em)`;
        // 太偏右 调整
        if( (vw - x) < (edgeDistance * ratio + aw / 2 * ratio)) x = vw - (edgeDistance * ratio + aw / 2 * ratio);
        arrowPosition.left = `calc(${x - vw}px + ${ew + edgeDistance - aw / 2}em)`;
    }else if(x <= (ew / 2 + edgeDistance) * ratio){
        // 单词位置靠左边框
        position.left = `${edgeDistance}em`;
        // 太偏左 调整
        if(x < (edgeDistance * ratio + aw / 2 * ratio)) x = edgeDistance * ratio + aw / 2 * ratio;
        arrowPosition.left = `calc(${x}px - ${edgeDistance + aw / 2}em)`;
    }else{
        // 中间
        position.left = `calc(${x}px - ${ew / 2}em)`;
        arrowPosition.left = `${ew / 2 - aw / 2}em`;
    }

    return {position,arrowPosition};
}

const playingWhich = (data, value, auto) => {
    let autoPlay = [false,false,false];
    if(auto === false) return autoPlay;
    // debugger
    switch (value){
        case 'us':
            if(data.audioUS) autoPlay[0] = true; break;
            if(data.audioUK) autoPlay[1] = true; break;
            if(data.audio) autoPlay[2] = true; break; 
        case 'uk':
            if(data.audioUK) autoPlay[1] = true; break;
            if(data.audioUS) autoPlay[0] = true; break;
            if(data.audio) autoPlay[2] = true; break;
        case 'tts':
            if(data.audio) autoPlay[2] = true; break;
            if(data.audioUS) autoPlay[0] = true; break;
            if(data.audioUK) autoPlay[1] = true; break;
        default:
            if(data.audioUS) {
                autoPlay[0] = true; 
                break;
            }
            if(data.audioUK) {
                autoPlay[1] = true;
                break;
            }
            if(data.audio) {
                autoPlay[2] = true; 
                break;
            }
    }
    return autoPlay;
}

const answerFormat = answer => {
    // answer = [["n.", "开关"],["vt.", "转变"]]
    if(!answer) return '';
    return answer.map( value => (<dt><b>{value[0]}</b>{value[1]}</dt>))
}
 
const Explanation = ({ expl, setSetting, setMoreFold, tapWord, setZoom }) =>{

    const Loading = (
        <div className="wrp-ep-loading">
            <div className="wrp-icon">
                <div className="wrp-loading-icon">
                    <div/> <div/>
                </div>
            </div>
        </div>
    );

    const renderMore = (moreList, unfold) => {
        let list = [];
        if ( ! Array.isArray(moreList) ) return list;
        if ( unfold ) {
            // 展开状态
            list = moreList.map( word => {
                return (<span onClick={()=>tapWord(word)}>{word}</span>)
            })
            list.push(<span 
                className="unfold-button"
                onClick={()=>setMoreFold()}            
                >{`<`}</span>)
        } else {
            // 折叠状态
            if (moreList.length >=1 ){
                list.push(<span onClick={()=>tapWord(moreList[0])}>{moreList[0]}</span>)
            }
            if(moreList.length > 1){
                list.push(<span 
                    className="unfold-button"
                    onClick={()=>setMoreFold()}            
                    >{`<`}</span>)
            }
        }
        return list;
    }

    let { position, arrowPosition } = calcPosition(expl.coordinate, expl.zoom)
    let data = expl.data || {}
    let setting = expl.setting || {}
    let autoPlay = playingWhich(data, setting.playWhich, setting.autoPlay)
    let more = expl.more || [];
    let zoom = {fontSize:`${14  + expl.zoom}px`}
    return (
        <div
            id="wrp-ep"
            className={`explain-panel ${expl.show ? '' : 'explain-hidden'}`} 
            style={{...position, ...zoom }}
        >
            <div 
                className="wrp-ep-arrow-container" 
                style={ arrowPosition }
            >
                <div className="wrp-ep-arrow"></div>
            </div>
            <div className="wrp-explain-content">
                <div className="wrp-ep-title">
                    <div className="wrp-title-left">
                        <h3 className="wrp-title-word" 
                            style={ {fontSize: `${calcFontSize(1.2, 11, data.word || expl.word)}em`} }>
                            { data.word || expl.word }
                        </h3>
                        {
                            data.audioUS ? (
                            <div className="title-tts"  onClick={()=>document.getElementById("a-us").play()}>
                                <div className="" >US</div>
                                <svg 
                                    className="title-audio"
                                    // style={autoPlay[0]?playingStyle:{}}
                                    fill="var(--t-fore-c)"
                                    viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M541.2 132.3c-7.2-3.3-15.2-5-23.3-5-13.9 0-26.8 5.1-36.5 14.4L280.6 312.4h-158c-11.5 0-23.9 3.9-33.6 10.4h-4l-8.7 9.2c-7.5 7.9-12.2 20.8-12.2 33.8v290.7c0 15 6.7 31.4 16.9 41.6 10.2 10.3 26.6 16.9 41.6 16.9h158.2l200.7 165.6c8.4 7.9 23.3 16 35.6 16 5.6 0 16.5 0 27.1-8 10-4.2 17.8-10.4 23.1-18.6 5.7-8.6 8.4-19.1 8.4-32V184c0-12.9-2.8-23.4-8.4-32-5.8-9-14.6-15.6-26.1-19.7z m-24.8 57.4v642.9L310.2 662.5l-8.2-6.8v0.1H123.3V371.7h179l214.1-182zM899.3 300c-20.9-32.7-46.5-61.1-75.9-84.2l-0.1-0.1c-1.3-1.1-2.2-1.8-2.9-2.4-4.5-2.8-9.6-4.3-15.1-4.3-10.3 0-21.6 5.3-31.1 14.5l-0.1 0.1c-8.4 13.5-3.9 35.9 9 45.2l0.1 0.1c6.1 2.5 14.7 9.7 20.8 15.4 9.4 8.7 23.6 23.7 38.1 45.6 24.3 36.8 53.3 99.7 53.3 190.8 0 91-27.4 153.9-50.3 190.6-13.7 22-27.2 36.9-36.1 45.6-8.6 8.3-15.3 13.5-20.1 15.5l-0.1 0.1c-13.9 9.8-17.2 28.6-8.1 46.7 3.8 7.7 17.2 12.9 27.3 12.9 3.8 0 13.9 0 17.4-3.5 0.7-0.7 1.5-1.4 3.3-2.8 28.1-22.9 52.6-51 72.7-83.8 38.8-63.2 58.5-137.6 58.5-221.4 0-83.4-20.4-157.6-60.6-220.6z" p-id="778"></path><path d="M752.7 376.7c-23.8-27.4-48.4-40.2-53.7-42.1h-1.6l-1.9-1.3c-3.2-2.2-7.4-3.3-12-3.3-11.9 0-24.9 7.6-27.8 16.4l-0.3 1-0.6 0.9c-3.8 5.8-4.3 14.2-1.4 22.7 2.9 8.4 8.6 15.1 14.6 17.1l0.6 0.2 0.6 0.3c0.7 0.4 17.2 9.5 33.6 29.7 15.1 18.5 33.1 50.3 33.1 96.7 0 96.6-54.4 128.5-60.7 131.9-13.8 9.4-23 27.9-14.6 40.4l0.3 0.4 0.2 0.5c4.3 8.7 18.9 18.6 27.3 18.6 5.5 0 8.4-0.1 11.7-3.8l2.2-2.2H704.7c6.2-2.3 28.7-15.6 50.6-44.2 20.6-26.9 45.1-74.4 45.1-147.4 0-64.2-25.9-107.5-47.7-132.5z" p-id="779"></path></svg>
                                <audio id="a-us" key={data.audioUS} src={data.audioUS} autoPlay={autoPlay[0]} ></audio>
                            </div>)
                            :
                            ''
                        }
                        {
                            data.audioUK ? (
                            <div className="title-tts" onClick={()=>document.getElementById("a-uk").play()}>
                                <div className="" >UK</div>
                                <svg 
                                    className="title-audio" 
                                    // style={autoPlay[1]?playingStyle:{}}
                                    fill="var(--t-fore-c)"
                                    viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M541.2 132.3c-7.2-3.3-15.2-5-23.3-5-13.9 0-26.8 5.1-36.5 14.4L280.6 312.4h-158c-11.5 0-23.9 3.9-33.6 10.4h-4l-8.7 9.2c-7.5 7.9-12.2 20.8-12.2 33.8v290.7c0 15 6.7 31.4 16.9 41.6 10.2 10.3 26.6 16.9 41.6 16.9h158.2l200.7 165.6c8.4 7.9 23.3 16 35.6 16 5.6 0 16.5 0 27.1-8 10-4.2 17.8-10.4 23.1-18.6 5.7-8.6 8.4-19.1 8.4-32V184c0-12.9-2.8-23.4-8.4-32-5.8-9-14.6-15.6-26.1-19.7z m-24.8 57.4v642.9L310.2 662.5l-8.2-6.8v0.1H123.3V371.7h179l214.1-182zM899.3 300c-20.9-32.7-46.5-61.1-75.9-84.2l-0.1-0.1c-1.3-1.1-2.2-1.8-2.9-2.4-4.5-2.8-9.6-4.3-15.1-4.3-10.3 0-21.6 5.3-31.1 14.5l-0.1 0.1c-8.4 13.5-3.9 35.9 9 45.2l0.1 0.1c6.1 2.5 14.7 9.7 20.8 15.4 9.4 8.7 23.6 23.7 38.1 45.6 24.3 36.8 53.3 99.7 53.3 190.8 0 91-27.4 153.9-50.3 190.6-13.7 22-27.2 36.9-36.1 45.6-8.6 8.3-15.3 13.5-20.1 15.5l-0.1 0.1c-13.9 9.8-17.2 28.6-8.1 46.7 3.8 7.7 17.2 12.9 27.3 12.9 3.8 0 13.9 0 17.4-3.5 0.7-0.7 1.5-1.4 3.3-2.8 28.1-22.9 52.6-51 72.7-83.8 38.8-63.2 58.5-137.6 58.5-221.4 0-83.4-20.4-157.6-60.6-220.6z" p-id="778"></path><path d="M752.7 376.7c-23.8-27.4-48.4-40.2-53.7-42.1h-1.6l-1.9-1.3c-3.2-2.2-7.4-3.3-12-3.3-11.9 0-24.9 7.6-27.8 16.4l-0.3 1-0.6 0.9c-3.8 5.8-4.3 14.2-1.4 22.7 2.9 8.4 8.6 15.1 14.6 17.1l0.6 0.2 0.6 0.3c0.7 0.4 17.2 9.5 33.6 29.7 15.1 18.5 33.1 50.3 33.1 96.7 0 96.6-54.4 128.5-60.7 131.9-13.8 9.4-23 27.9-14.6 40.4l0.3 0.4 0.2 0.5c4.3 8.7 18.9 18.6 27.3 18.6 5.5 0 8.4-0.1 11.7-3.8l2.2-2.2H704.7c6.2-2.3 28.7-15.6 50.6-44.2 20.6-26.9 45.1-74.4 45.1-147.4 0-64.2-25.9-107.5-47.7-132.5z" p-id="779"></path></svg>
                                <audio id="a-uk" key={data.audioUK} src={data.audioUK} autoPlay={autoPlay[1]} ></audio>
                            </div>)
                            :
                            ""
                        }
                        {
                            (!data.audioUK || !data.audioUS && data.audio) ? (
                            <div className="title-tts"  onClick={()=>document.getElementById("a-tts").play()}>
                                <svg
                                    className="title-audio" 
                                    // style={autoPlay[2]?playingStyle:{}}
                                    fill="var(--t-fore-c)" 
                                    viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M541.2 132.3c-7.2-3.3-15.2-5-23.3-5-13.9 0-26.8 5.1-36.5 14.4L280.6 312.4h-158c-11.5 0-23.9 3.9-33.6 10.4h-4l-8.7 9.2c-7.5 7.9-12.2 20.8-12.2 33.8v290.7c0 15 6.7 31.4 16.9 41.6 10.2 10.3 26.6 16.9 41.6 16.9h158.2l200.7 165.6c8.4 7.9 23.3 16 35.6 16 5.6 0 16.5 0 27.1-8 10-4.2 17.8-10.4 23.1-18.6 5.7-8.6 8.4-19.1 8.4-32V184c0-12.9-2.8-23.4-8.4-32-5.8-9-14.6-15.6-26.1-19.7z m-24.8 57.4v642.9L310.2 662.5l-8.2-6.8v0.1H123.3V371.7h179l214.1-182zM899.3 300c-20.9-32.7-46.5-61.1-75.9-84.2l-0.1-0.1c-1.3-1.1-2.2-1.8-2.9-2.4-4.5-2.8-9.6-4.3-15.1-4.3-10.3 0-21.6 5.3-31.1 14.5l-0.1 0.1c-8.4 13.5-3.9 35.9 9 45.2l0.1 0.1c6.1 2.5 14.7 9.7 20.8 15.4 9.4 8.7 23.6 23.7 38.1 45.6 24.3 36.8 53.3 99.7 53.3 190.8 0 91-27.4 153.9-50.3 190.6-13.7 22-27.2 36.9-36.1 45.6-8.6 8.3-15.3 13.5-20.1 15.5l-0.1 0.1c-13.9 9.8-17.2 28.6-8.1 46.7 3.8 7.7 17.2 12.9 27.3 12.9 3.8 0 13.9 0 17.4-3.5 0.7-0.7 1.5-1.4 3.3-2.8 28.1-22.9 52.6-51 72.7-83.8 38.8-63.2 58.5-137.6 58.5-221.4 0-83.4-20.4-157.6-60.6-220.6z" p-id="778"></path><path d="M752.7 376.7c-23.8-27.4-48.4-40.2-53.7-42.1h-1.6l-1.9-1.3c-3.2-2.2-7.4-3.3-12-3.3-11.9 0-24.9 7.6-27.8 16.4l-0.3 1-0.6 0.9c-3.8 5.8-4.3 14.2-1.4 22.7 2.9 8.4 8.6 15.1 14.6 17.1l0.6 0.2 0.6 0.3c0.7 0.4 17.2 9.5 33.6 29.7 15.1 18.5 33.1 50.3 33.1 96.7 0 96.6-54.4 128.5-60.7 131.9-13.8 9.4-23 27.9-14.6 40.4l0.3 0.4 0.2 0.5c4.3 8.7 18.9 18.6 27.3 18.6 5.5 0 8.4-0.1 11.7-3.8l2.2-2.2H704.7c6.2-2.3 28.7-15.6 50.6-44.2 20.6-26.9 45.1-74.4 45.1-147.4 0-64.2-25.9-107.5-47.7-132.5z" p-id="779"></path></svg>
                                <audio id="a-tts" key={data.audio} src={data.audio} autoPlay={autoPlay[2]}></audio>
                            </div>
                            )
                            :
                            ""
                        }
                        
                    </div>
                    <div>
                        <svg 
                            className="wrp-title-button" 
                            style={{display:'none'}} 
                            fill="var(--t-fore-c)" 
                            viewBox="0 0 1024 1024" version="1.1" width="200" height="200" ><defs><style type="text/css"></style></defs><path d="M1009.562 454.103c-72.264 88.023-200.049 233.339-200.049 233.339s20.9 159.55 32.614 268.534c5.09 55.51-34.928 79.513-80.25 57.876-86.242-43.325-217.478-110.448-247-125.573-30.044 14.97-162.6 80.988-249.733 124.211-45.844 21.586-86.343-2.416-81.193-57.825 11.869-108.82 32.983-268.216 32.983-268.216S87.685 541.44 14.582 453.529c-25.836-31.928-9.247-77.311 41.697-85.657 103.885-19.64 264.909-50.944 264.909-50.944s88.074-162.335 143.8-261.755C495.657-5.325 516.874 1.66 520.5 3.441c9.452 3.256 24.371 15.022 43.848 51.783 55.091 99.574 142.172 262.124 142.172 262.124s159.13 31.304 261.806 50.995c50.33 8.397 66.765 53.832 41.237 85.76z"  p-id="3336"></path></svg>
                        <svg 
                            className={`wrp-title-button ${ setting.show ? "expl-menu-show" : "expl-menu-hidden" }`} 
                            onClick={()=>{ setSetting({show:!setting.show})}} 
                            fill="var(--t-fore-c)" 
                            viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M415.93 223.79c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.003-95.984-95.984zM415.93 511.742c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.004-95.984-95.984zM415.93 799.866c0-52.98 43.004-95.984 95.984-95.984s95.984 43.003 95.984 95.984-43.004 95.983-95.984 95.983-95.984-43.175-95.984-95.983z" p-id="4126"></path></svg>
                    </div>
                </div>

                <div className="wrp-ep-content">
                    <dl style={expl.menuBgStyle}>
                        { expl.status === 'completed' ? answerFormat(data.answer) : Loading }
                    </dl>
                    <div className={`more-word-contanier ${expl.unfoldMore ? 'more-unfold' : ''}`}>
                        { renderMore(more, expl.unfoldMore) }
                    </div>
                    {/* MENU 更多 菜单 */}
                    <div className={`wrp-ep-menu ${ setting.show ? "wrp-expl-menu-show" : ""}`} >
                        <div>
                            <span>Auto Speech</span>
                            <Switch
                                status={setting.autoPlay !== false} 
                                switchChange={(status)=> setSetting({autoPlay: status})}
                                onStyle={{backgroundColor:'var(--sc)'}}
                            ></Switch>
                        </div>
                        <div>
                            <span>Speech US</span>
                            <Switch
                                status={setting.playWhich ? setting.playWhich === 'us': true} 
                                switchChange={(status)=> setSetting({playWhich: status ? 'us' : 'uk'})}
                                onStyle={{backgroundColor:'var(--sc)'}}
                            ></Switch>
                        </div>  
                        <svg className="menu-button" onClick={()=>setZoom(1)} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" p-id="2685" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-128 0 0-128c0-19.2-12.8-32-32-32s-32 12.8-32 32l0 128-128 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l128 0 0 128c0 19.2 12.8 32 32 32s32-12.8 32-32l0-128 128 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2686"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2687"></path></svg>
                        <svg className="menu-button" onClick={()=>setZoom(-1)} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" p-id="2556" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-320 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l320 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2557"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2558"></path></svg>
                    </div>
                </div>  
            </div>
                        
        </div>
    )
}

 export default Explanation