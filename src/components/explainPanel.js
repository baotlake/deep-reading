import React from "react";

import Switch from './switch.js';

import './explainPanel.css';

import arrow_icon from "./res/explainBoxArrow.svg";
import audio_icon from "./res/audio.svg";
import star_icon from "./res/star.svg";
import menu_icon from "./res/more.svg";
import open_icon from './res/open.svg';
import arrowShadow_icon from './res/arrowShadow.png'

class ExpainPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            more:{
                style:{opacity:0,width:0},
                isShow:false
            },
            menu:{
                style:{},
                isShow:false,
                backStyle:{},
            },
            data:{
                word:'',
                audio:'',
                audioUK:'',
                audioUS:'',
                expain:'',
                moreWord:[],
                starred:false
            },
            autoPlay:true,
            playUS:true,
            zoom:0,
            status:'1',
            // status: 0, loading; 1, completed
        }
        this.clickedWord = {};
        this.positionStyle = {
            style:{
                "width":"17em",
                "height":"8em",
                "position":"absolute"
            },
            arrowStyle:{
                "position":"absolute",
                "width":"2.8em",
                "height":"2.8em",
                // "top":"-1.9em"
            },
            x:0, // test
            y:0      // test
        }
        this.moreElements = [];
        this.audioElements = [];
        this.epFontSize = 14;
    }


    calcArrowPostion(positionStyle, position){
        // console.log('position,. ', position)
        // 返回style={}, x,y 为箭头中心点
        //window.width, window.height
        let x = position.x, y= position.y, clientY = position.clientY;
        let ww = window.innerWidth, wh= window.innerHeight;
        let style =  Object.assign({},positionStyle.style);
        let arrowStyle = Object.assign({},positionStyle.arrowStyle);
        let aw = parseFloat(arrowStyle.width);
        let ah = parseFloat(arrowStyle.height);

        let ew = parseFloat(style.width), eh = parseFloat(style.height);
        const topDistance = 12;         //em 顶部距离小于topDistance时,expainPanel显示在单词下方
        const wordDistance = 3;         //em expainPanel距离单词的距离
        const edgeDistance = 1;         //em 左右边距
        const arrowOverlapping = 0.1;   // 箭头和框的重叠距离

        let remRatioPx = 16;            // 1 rem = 16 px
        remRatioPx = remRatioPx + remRatioPx*this.state.zoom;

        // x 不能小于18,不能大于 ww - 18, 否则箭头和框出现分离, 下面两行代码矫正
        // if(x < 18) x = 18;
        // if(x > ww - 18) x = ww - 18;

        //纵向位置 Vertical position
        if(clientY >= topDistance * remRatioPx){
            // expainPanel显示在单词上方
            style.top = `calc(${y}px - ${eh}em - ${wordDistance}em)`;
            // arrowStyle.transform = 'rotate(180deg)'
            arrowStyle.top = `${eh - ah / 2 - arrowOverlapping}em`
        }else{
            // expainPanel显示在单词下方
            style.top = `calc(${y}px + ${wordDistance}em)`;
            arrowStyle.top = `-${ah / 2 - arrowOverlapping}em`;
            // arrowStyle.transform = 'rotate(0deg)';
        }


        // 横向位置 Horizontal position
        if(x >= ww - (ew / 2 + edgeDistance) * remRatioPx){
            // 单词位置靠右边框
            style.left = `calc(${ww}px - ${ew}em - ${edgeDistance}em)`;
            // 太偏右 调整
            if( (ww - x) < (edgeDistance * remRatioPx + aw / 2 * remRatioPx)) x = ww - (edgeDistance * remRatioPx + aw / 2 * remRatioPx);
            arrowStyle.left = `calc(${x - ww}px + ${ew + edgeDistance - aw / 2}em)`;
        }else if(x <= (ew / 2 + edgeDistance) * remRatioPx){
            // 单词位置靠左边框
            style.left = `${edgeDistance}em`;
            // 太偏左 调整
            if(x < (edgeDistance * remRatioPx + aw / 2 * remRatioPx)) x = edgeDistance * remRatioPx + aw / 2 * remRatioPx;
            arrowStyle.left = `calc(${x}px - ${edgeDistance + aw / 2}em)`;
        }else{
            // 中间
            style.left = `calc(${x}px - ${ew / 2}em)`;
            arrowStyle.left = `${ew / 2 - aw / 2}em`;
        }

        return {style,arrowStyle,x,y};
  
    }

    setWord(w){
        if(!w) w = this.props.clickedWord.word;
        let data = this.state.data;
        data.word = w;
        this.setState({
            data:data,
            status:'0'
        })
    }

    aliIciba(w){
        if(!w) w = this.props.clickedWord.word;
        w = w.toLowerCase();

        // if(this.state.data.word == w) return ;
        // let url = `https://1773134661611650.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/WordingReadingPro/iciba/?key=zysj&q=${w};`
        // let url = `https://service-edwl7wbn-1258889000.sh.apigw.tencentcs.com/test/iciba_tr?key=zysj&q=${w}`;
        let url = `http://47.94.145.177:8000/iciba?w=${w}`;
        let request = new XMLHttpRequest(false,true);
        let self = this;
        request.open("GET",url);
        request.withCredentials = false;
        // myRequest.setRequestHeader('Referer','');
        request.onreadystatechange = function(){
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200){
                let responseText = request.responseText;
                let json = JSON.parse(responseText);
                // console.log("response", json);
                self.icibaParseData(json, w,);
            }else{

            }
        }

        request.send();

    }

    icibaParseData(json,w){
        let data = {};
        data.word = w;
        data.moreWord = [];
        if(Object.keys(json).includes('word_name')){
            data.audio = json.symbols[0].ph_tts_mp3;
            data.audioUK = json.symbols[0].ph_en_mp3;
            data.audioUS = json.symbols[0].ph_am_mp3;
            // data.expain = json.symbols[0].parts.map(o=>o.part + o.means.join(' ')).join('\n');
            data.expain = json.symbols[0].parts.map(o=><dt className="wrp-explain-text"><span className="wrp-explain-tag">{o.part + ' '}</span>{o.means.join(' ')}</dt>);
            // data.moreWord = json.exchange.word_pl;

            // 提取单词解释里的单词
            let more = json.symbols[0].parts.map(i=>i.means.join(' ')).join(' ').match(/[a-zA-Z]{3,20}/);
            if(more) data.moreWord.push(more[0]);
        }
        
        // data.moreWord = ['word','most','many'];
        // console.log('parsed data', data);

        this.setState({
            data:data,
            status:'1'
        });
        return data;
    }

    // 废弃
    renderArrow(){
        // <canvas id="e-arrow" width="60" height="60" ></canvas>
        var canvas = document.getElementById('e-arrow');
        console.log('canvas ', canvas)
        if(canvas.getContext){
            console.log("getContext", canvas.getContext)
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(0, 50);
            ctx.lineTo(60, 30);
            ctx.lineTo(20, 25);
            ctx.fill();
        }else{
            console.log("no canvas Context" )
        }   
    }

    handleClickMenu(){
        console.log('menu')
        let menu = this.state.menu;
        if(this.state.menu.isShow){
            menu.isShow = false;
            menu.style = {right:'-20em',opacity:0};
            menu.backStyle = {filter:'blur(0px)'}
        }else{
            menu.isShow = true;
            menu.style = {right:'0em',opacity:1};
            menu.backStyle = {filter:'blur(30px)'}
        }   
        this.setState({
            menu:menu
        })
    }

    handleClickMore(){
        let more = this.state.more;
        if(this.state.data.moreWord.length <= 1) return '';
        if(this.state.more.isShow){
            more.isShow = false;
            more.style = {opacity:0,maxWidth:0,transition:'all 0.5s',display:'flex'};
        }else{
            more.isShow = true;
            more.style = {opacity:1,maxWidth:'15em',transition:'all 0.5s',display:'flex'};
        }
        this.setState({
            more:more
        })
    }

    handleClickMoreWord(w){
        this.setWord(w)
        this.aliIciba(w);
    }

    handleSetting(key, value){
        switch(key){
            case 'autoPlay':
                this.setState({
                    autoPlay:value
                });
                break;
            case 'playUS':
                this.setState({
                    playUS:value
                });
                break;
            case 'zoom':
                    let zoom = this.state.zoom;
                    zoom = zoom + value;
                    if(zoom > 10) zoom = 10;
                    if(zoom < -10) zoom = -10;
                    console.log('zoom', zoom)
                    this.setState({
                        zoom:zoom
                    });
                    this.positionStyle = this.calcArrowPostion(this.positionStyle, this.props.clickedWord.position);
                    break;
        }
    }

    componentDidMount(){
        // this.renderArrow()
        let ep = document.getElementById('wrp-ep');
        let fontSize =parseInt(window.getComputedStyle(ep,null).fontSize);
        if(fontSize > 5 && fontSize < 30){
            this.epFontSize = fontSize;
        }

    }

    audio(data){
        let audioList = [];
        let playingStyle = {animation :"0.3s ease-out 0.1s 2 alternate wrp-audio"};
        // if(!data.audio && !data.audioUK && !data.audioUS) return audioList;

        // 优先级计算
        let autoPlay = [[this.state.playUS?2:1, !!data.audioUS],[!this.state.playUS?2:1, !!data.audioUK],[0, !!data.audio]].map(
            (n,i,t,auto=this.state.autoPlay)=>{
                // console.log(n, n[0] + n[1] * 3, (n[0] + n[1] * 3),auto ,(n[0] + n[1] * 3) * auto)
                return (n[0] + n[1] * 3) * auto;
            }
        );
        // console.log('autoPlay n',autoPlay)
        let max = autoPlay[0] > autoPlay[1]?autoPlay[0]:autoPlay[1]; max = max > autoPlay[2]?max:autoPlay[2];
        autoPlay = autoPlay.map(
            (n,i,t,m=max)=>{
                // console.log('n,max',n,m)
                if(n == m && n >= 3){
                    return true;
                }else{
                    return false;
                }
            }
        );

        if(data.audioUS){
            audioList.push(
                <div className="title-tts"  onClick={()=>document.getElementById("a-us").play()}>
                    <div className="" >US</div>
                    {/*<img className="title-audio" style={autoPlay[0]?playingStyle:{}} src={audio_icon}></img>*/}
                    <svg className="title-audio" style={autoPlay[0]?playingStyle:{}} viewBox="0 0 1024 1024" fill="var(--t-fore-c)" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M541.2 132.3c-7.2-3.3-15.2-5-23.3-5-13.9 0-26.8 5.1-36.5 14.4L280.6 312.4h-158c-11.5 0-23.9 3.9-33.6 10.4h-4l-8.7 9.2c-7.5 7.9-12.2 20.8-12.2 33.8v290.7c0 15 6.7 31.4 16.9 41.6 10.2 10.3 26.6 16.9 41.6 16.9h158.2l200.7 165.6c8.4 7.9 23.3 16 35.6 16 5.6 0 16.5 0 27.1-8 10-4.2 17.8-10.4 23.1-18.6 5.7-8.6 8.4-19.1 8.4-32V184c0-12.9-2.8-23.4-8.4-32-5.8-9-14.6-15.6-26.1-19.7z m-24.8 57.4v642.9L310.2 662.5l-8.2-6.8v0.1H123.3V371.7h179l214.1-182zM899.3 300c-20.9-32.7-46.5-61.1-75.9-84.2l-0.1-0.1c-1.3-1.1-2.2-1.8-2.9-2.4-4.5-2.8-9.6-4.3-15.1-4.3-10.3 0-21.6 5.3-31.1 14.5l-0.1 0.1c-8.4 13.5-3.9 35.9 9 45.2l0.1 0.1c6.1 2.5 14.7 9.7 20.8 15.4 9.4 8.7 23.6 23.7 38.1 45.6 24.3 36.8 53.3 99.7 53.3 190.8 0 91-27.4 153.9-50.3 190.6-13.7 22-27.2 36.9-36.1 45.6-8.6 8.3-15.3 13.5-20.1 15.5l-0.1 0.1c-13.9 9.8-17.2 28.6-8.1 46.7 3.8 7.7 17.2 12.9 27.3 12.9 3.8 0 13.9 0 17.4-3.5 0.7-0.7 1.5-1.4 3.3-2.8 28.1-22.9 52.6-51 72.7-83.8 38.8-63.2 58.5-137.6 58.5-221.4 0-83.4-20.4-157.6-60.6-220.6z" p-id="778"></path><path d="M752.7 376.7c-23.8-27.4-48.4-40.2-53.7-42.1h-1.6l-1.9-1.3c-3.2-2.2-7.4-3.3-12-3.3-11.9 0-24.9 7.6-27.8 16.4l-0.3 1-0.6 0.9c-3.8 5.8-4.3 14.2-1.4 22.7 2.9 8.4 8.6 15.1 14.6 17.1l0.6 0.2 0.6 0.3c0.7 0.4 17.2 9.5 33.6 29.7 15.1 18.5 33.1 50.3 33.1 96.7 0 96.6-54.4 128.5-60.7 131.9-13.8 9.4-23 27.9-14.6 40.4l0.3 0.4 0.2 0.5c4.3 8.7 18.9 18.6 27.3 18.6 5.5 0 8.4-0.1 11.7-3.8l2.2-2.2H704.7c6.2-2.3 28.7-15.6 50.6-44.2 20.6-26.9 45.1-74.4 45.1-147.4 0-64.2-25.9-107.5-47.7-132.5z" p-id="779"></path></svg>
                    <audio id="a-us" src={data.audioUS} autoPlay={autoPlay[0]}></audio>
                </div>
            )
        }

        if(data.audioUK){
            audioList.push(
                <div className="title-tts" onClick={()=>document.getElementById("a-uk").play()}>
                    <div className="" >UK</div>
                    {/*<img className="title-audio" style={autoPlay[1]?playingStyle:{}} src={audio_icon}></img>*/}
                    <svg className="title-audio" style={autoPlay[1]?playingStyle:{}} viewBox="0 0 1024 1024" fill="var(--t-fore-c)" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M541.2 132.3c-7.2-3.3-15.2-5-23.3-5-13.9 0-26.8 5.1-36.5 14.4L280.6 312.4h-158c-11.5 0-23.9 3.9-33.6 10.4h-4l-8.7 9.2c-7.5 7.9-12.2 20.8-12.2 33.8v290.7c0 15 6.7 31.4 16.9 41.6 10.2 10.3 26.6 16.9 41.6 16.9h158.2l200.7 165.6c8.4 7.9 23.3 16 35.6 16 5.6 0 16.5 0 27.1-8 10-4.2 17.8-10.4 23.1-18.6 5.7-8.6 8.4-19.1 8.4-32V184c0-12.9-2.8-23.4-8.4-32-5.8-9-14.6-15.6-26.1-19.7z m-24.8 57.4v642.9L310.2 662.5l-8.2-6.8v0.1H123.3V371.7h179l214.1-182zM899.3 300c-20.9-32.7-46.5-61.1-75.9-84.2l-0.1-0.1c-1.3-1.1-2.2-1.8-2.9-2.4-4.5-2.8-9.6-4.3-15.1-4.3-10.3 0-21.6 5.3-31.1 14.5l-0.1 0.1c-8.4 13.5-3.9 35.9 9 45.2l0.1 0.1c6.1 2.5 14.7 9.7 20.8 15.4 9.4 8.7 23.6 23.7 38.1 45.6 24.3 36.8 53.3 99.7 53.3 190.8 0 91-27.4 153.9-50.3 190.6-13.7 22-27.2 36.9-36.1 45.6-8.6 8.3-15.3 13.5-20.1 15.5l-0.1 0.1c-13.9 9.8-17.2 28.6-8.1 46.7 3.8 7.7 17.2 12.9 27.3 12.9 3.8 0 13.9 0 17.4-3.5 0.7-0.7 1.5-1.4 3.3-2.8 28.1-22.9 52.6-51 72.7-83.8 38.8-63.2 58.5-137.6 58.5-221.4 0-83.4-20.4-157.6-60.6-220.6z" p-id="778"></path><path d="M752.7 376.7c-23.8-27.4-48.4-40.2-53.7-42.1h-1.6l-1.9-1.3c-3.2-2.2-7.4-3.3-12-3.3-11.9 0-24.9 7.6-27.8 16.4l-0.3 1-0.6 0.9c-3.8 5.8-4.3 14.2-1.4 22.7 2.9 8.4 8.6 15.1 14.6 17.1l0.6 0.2 0.6 0.3c0.7 0.4 17.2 9.5 33.6 29.7 15.1 18.5 33.1 50.3 33.1 96.7 0 96.6-54.4 128.5-60.7 131.9-13.8 9.4-23 27.9-14.6 40.4l0.3 0.4 0.2 0.5c4.3 8.7 18.9 18.6 27.3 18.6 5.5 0 8.4-0.1 11.7-3.8l2.2-2.2H704.7c6.2-2.3 28.7-15.6 50.6-44.2 20.6-26.9 45.1-74.4 45.1-147.4 0-64.2-25.9-107.5-47.7-132.5z" p-id="779"></path></svg>
                    <audio id="a-uk" src={data.audioUK} autoPlay={autoPlay[1]}></audio>
                </div>
            )
        }

        if(audioList.length == 0 && data.audio){
            audioList.push(
                <div className="title-tts"  onClick={()=>document.getElementById("a-tts").play()}>
                    {/*<img className="title-audio" style={autoPlay[2]?playingStyle:{}} src={audio_icon}></img>*/}
                    <svg className="title-audio" style={autoPlay[2]?playingStyle:{}} viewBox="0 0 1024 1024" fill="var(--t-fore-c)" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M541.2 132.3c-7.2-3.3-15.2-5-23.3-5-13.9 0-26.8 5.1-36.5 14.4L280.6 312.4h-158c-11.5 0-23.9 3.9-33.6 10.4h-4l-8.7 9.2c-7.5 7.9-12.2 20.8-12.2 33.8v290.7c0 15 6.7 31.4 16.9 41.6 10.2 10.3 26.6 16.9 41.6 16.9h158.2l200.7 165.6c8.4 7.9 23.3 16 35.6 16 5.6 0 16.5 0 27.1-8 10-4.2 17.8-10.4 23.1-18.6 5.7-8.6 8.4-19.1 8.4-32V184c0-12.9-2.8-23.4-8.4-32-5.8-9-14.6-15.6-26.1-19.7z m-24.8 57.4v642.9L310.2 662.5l-8.2-6.8v0.1H123.3V371.7h179l214.1-182zM899.3 300c-20.9-32.7-46.5-61.1-75.9-84.2l-0.1-0.1c-1.3-1.1-2.2-1.8-2.9-2.4-4.5-2.8-9.6-4.3-15.1-4.3-10.3 0-21.6 5.3-31.1 14.5l-0.1 0.1c-8.4 13.5-3.9 35.9 9 45.2l0.1 0.1c6.1 2.5 14.7 9.7 20.8 15.4 9.4 8.7 23.6 23.7 38.1 45.6 24.3 36.8 53.3 99.7 53.3 190.8 0 91-27.4 153.9-50.3 190.6-13.7 22-27.2 36.9-36.1 45.6-8.6 8.3-15.3 13.5-20.1 15.5l-0.1 0.1c-13.9 9.8-17.2 28.6-8.1 46.7 3.8 7.7 17.2 12.9 27.3 12.9 3.8 0 13.9 0 17.4-3.5 0.7-0.7 1.5-1.4 3.3-2.8 28.1-22.9 52.6-51 72.7-83.8 38.8-63.2 58.5-137.6 58.5-221.4 0-83.4-20.4-157.6-60.6-220.6z" p-id="778"></path><path d="M752.7 376.7c-23.8-27.4-48.4-40.2-53.7-42.1h-1.6l-1.9-1.3c-3.2-2.2-7.4-3.3-12-3.3-11.9 0-24.9 7.6-27.8 16.4l-0.3 1-0.6 0.9c-3.8 5.8-4.3 14.2-1.4 22.7 2.9 8.4 8.6 15.1 14.6 17.1l0.6 0.2 0.6 0.3c0.7 0.4 17.2 9.5 33.6 29.7 15.1 18.5 33.1 50.3 33.1 96.7 0 96.6-54.4 128.5-60.7 131.9-13.8 9.4-23 27.9-14.6 40.4l0.3 0.4 0.2 0.5c4.3 8.7 18.9 18.6 27.3 18.6 5.5 0 8.4-0.1 11.7-3.8l2.2-2.2H704.7c6.2-2.3 28.7-15.6 50.6-44.2 20.6-26.9 45.1-74.4 45.1-147.4 0-64.2-25.9-107.5-47.7-132.5z" p-id="779"></path></svg>
                    <audio id="a-tts" src={data.audio} autoPlay={autoPlay[2]}></audio>
                </div>
            )
        }

        return audioList;
    }

    more(data){
        let moreList = [];
        let packList = []; // 多于一个单词时，多的单词放入packList中折叠， 点击显示
        if(!data.moreWord) return moreList;
        for(let i=0; i < data.moreWord.length; i++){
            if(i == 0){
                moreList.push(
                    <span className="more-word" onClick={()=>this.handleClickMoreWord(data.moreWord[i])}>{data.moreWord[i]}</span> 
                );
            }else{
                packList.push(
                    <span className="more-word" onClick={()=>this.handleClickMoreWord(data.moreWord[i])}>{data.moreWord[i]}</span> 
                );
            }
        }
        // console.log('moreList', moreList, moreList.length)
        if (packList.length > 0){
            moreList.unshift(
                <svg className="more-open" onClick={()=>this.handleClickMore()} viewBox="0 0 1024 1024" fill="var(--t-fore-c)" version="1.1" width="200" height="200"><path d="M553.28 1010.112L55.488 512.32 553.984 13.824l45.248 45.248-453.248 453.248 452.672 452.544z" p-id="4883" ></path><path d="M916.736 1010.112L419.008 512.32 917.504 13.824l45.248 45.248-453.248 453.248 452.48 452.544z" p-id="4884"></path></svg>
            );
            moreList.push(
                <div style={this.state.more.style} >{packList}</div>
            );
        }

        return moreList;
    }

    calcFontSize(size,maxNumber,text){
        /**size:初始字符大小, maxNumber:初始字符大小下可以显示的最大字符, text：当前字符 */
        if(!text) return size;
        if(text.length <= maxNumber) return size;
        return size*maxNumber/text.length;
    }

    render(){

        let isShow = this.props.show;
        let data = this.state.data;

        if(this.state.data.word != ''){

        }

        if(this.props.clickedWord != this.clickedWord && this.props.clickedWord.word){
            this.clickedWord = this.props.clickedWord;
            this.setWord();
            this.aliIciba();
            this.positionStyle = this.calcArrowPostion(this.positionStyle, this.props.clickedWord.position);
            if(this.props.clickedWord.word.toLowerCase() != this.state.data.word) data = {};

            if(this.state.more.isShow) this.handleClickMore();
            if(this.state.menu.isShow) this.handleClickMenu();
        }


        // zoom
        let Zoomstyle = Object.assign({}, this.positionStyle.style);
        Zoomstyle.fontSize = `${this.epFontSize + this.state.zoom}px`;

        this.positionStyle.style = Zoomstyle;
        
        this.moreElements = this.more(data);
        this.audioElements = this.audio(data);

        let test = {
            top:`${this.positionStyle.y}px`,
            left:`${this.positionStyle.x}px`,
            position:"absolute",
            backgroundColor:"#f00",
            width:"3px",
            height:"3px",
            display:'none'
        }

        let loading = (
            <div className="wrp-ep-loading">
                <div className="wrp-icon">
                    <div className="wrp-loading-icon">
                        <div/> <div/>
                    </div>
                </div>
            </div>
        );

        // <img className="arrow" style={position.arrowStyle} src={arrow}></img>
        // <svg className="arrow" style={position.arrowStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 143"><defs></defs><polygon  style={{fill:"#fff"}} points="7 143 67.5 16 128 143 7 143"/></svg>
        
        return (
            <div
                id="wrp-ep"
                className={`explain-panel ${isShow?'':'explain-hidden'}`} 
                style={this.positionStyle.style}
            >
                <div style={test}></div>
                {/*<img className="wrp-ep-arrow" style={this.positionStyle.arrowStyle} src={arrowShadow_icon}></img>
                <svg className="wrp-ep-arrow" style={this.positionStyle.arrowStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 143"><defs></defs><polygon  style={{fill:"#fff"}} points="7 143 67.5 16 128 143 7 143"/></svg>*/}
                <div className="wrp-ep-arrow-container" style={this.positionStyle.arrowStyle}>
                    <div className="wrp-ep-arrow"></div>
                </div>
                <div className="wrp-explain-content">
                    <div className="wrp-ep-title">
                        <div className="wrp-title-left">
                            <h1 className="wrp-title-word" 
                                style={{fontSize:`${this.calcFontSize(1.2, 11, this.state.data.word  || this.props.clickedWord.word)}em`}}>
                                {this.state.data.word  || this.props.clickedWord.word}
                            </h1>
                            {this.audioElements}
                        </div>
                        <div>
                            {/*<img className="wrp-title-button" hidden src={star_icon}></img>*/}
                            <svg className="wrp-title-button" style={{display:'none'}} viewBox="0 0 1024 1024" version="1.1" width="200" height="200" fill="var(--t-fore-c)"><defs><style type="text/css"></style></defs><path d="M1009.562 454.103c-72.264 88.023-200.049 233.339-200.049 233.339s20.9 159.55 32.614 268.534c5.09 55.51-34.928 79.513-80.25 57.876-86.242-43.325-217.478-110.448-247-125.573-30.044 14.97-162.6 80.988-249.733 124.211-45.844 21.586-86.343-2.416-81.193-57.825 11.869-108.82 32.983-268.216 32.983-268.216S87.685 541.44 14.582 453.529c-25.836-31.928-9.247-77.311 41.697-85.657 103.885-19.64 264.909-50.944 264.909-50.944s88.074-162.335 143.8-261.755C495.657-5.325 516.874 1.66 520.5 3.441c9.452 3.256 24.371 15.022 43.848 51.783 55.091 99.574 142.172 262.124 142.172 262.124s159.13 31.304 261.806 50.995c50.33 8.397 66.765 53.832 41.237 85.76z"  p-id="3336"></path></svg>
                            {/*<img className="wrp-title-button" onClick={()=>{this.handleClickMenu()}} src={menu_icon}></img>*/}
                            <svg className="wrp-title-button" onClick={()=>{this.handleClickMenu()}} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M415.93 223.79c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.003-95.984-95.984zM415.93 511.742c0-52.98 43.004-95.984 95.984-95.984s95.984 43.004 95.984 95.984-43.004 95.984-95.984 95.984-95.984-43.004-95.984-95.984zM415.93 799.866c0-52.98 43.004-95.984 95.984-95.984s95.984 43.003 95.984 95.984-43.004 95.983-95.984 95.983-95.984-43.175-95.984-95.983z" p-id="4126"></path></svg>
                        </div>
                    </div>

                    <div className="wrp-ep-content">
                        <dl style={this.state.menu.backStyle}>
                            {this.state.status=='1'?data.expain:loading}
                        </dl>
                        <div className="more-word-contanier">
                            {this.moreElements}
                        </div>
                        <div className="wrp-ep-menu" style={this.state.menu.style}>
                            <div>
                                <span>Auto Speech</span>
                                <Switch 
                                    status={this.state.autoPlay} 
                                    switchChange={(status)=>this.handleSetting('autoPlay',status)}
                                    onStyle={{backgroundColor:'var(--sc)'}}
                                ></Switch>
                            </div>
                            <div>
                                <span>Speech US</span>
                                <Switch 
                                    status={this.state.playUS} 
                                    switchChange={(status)=>this.handleSetting('playUS',status)}
                                    onStyle={{backgroundColor:'var(--sc)'}}
                                ></Switch>
                            </div>  
                            <svg className="menu-button" onClick={()=>this.handleSetting('zoom',1)} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" p-id="2685" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-128 0 0-128c0-19.2-12.8-32-32-32s-32 12.8-32 32l0 128-128 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l128 0 0 128c0 19.2 12.8 32 32 32s32-12.8 32-32l0-128 128 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2686"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2687"></path></svg>
                            <svg className="menu-button" onClick={()=>this.handleSetting('zoom',-1)} fill="var(--t-fore-c)" viewBox="0 0 1024 1024" version="1.1" p-id="2556" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-320 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l320 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2557"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2558"></path></svg>
                        </div>
                    </div>  
                </div>
                            
            </div>
        )
    }
}


export default ExpainPanel;