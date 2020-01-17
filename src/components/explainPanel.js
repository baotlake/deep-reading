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
                isShow:false
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
        }
    }

    calcArrowPostion(positionStyle, position){
        console.log('position,. ', position)
        // 返回style={}, x,y 为箭头中心点
        //window.width, window.height
        let x = position.x, y= position.y, clientY = position.clientY;
        let ww = window.innerWidth, wh= window.innerHeight;
        let style =  positionStyle.style;
        let arrowStyle = positionStyle.arrowStyle;
        let aw = parseFloat(arrowStyle.width);
        let ah = parseFloat(arrowStyle.height);

        let ew = parseFloat(style.width), eh = parseFloat(style.height);
        const topDistance = 12;         //em 顶部距离小于20时,expainPanel显示在单词下方
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
            arrowStyle.transform = 'rotate(180deg)'
            arrowStyle.top = `${eh - arrowOverlapping}em`
        }else{
            // expainPanel显示在单词下方
            style.top = `calc(${y}px + ${wordDistance}em)`;
            arrowStyle.top = `-${ah - arrowOverlapping}em`;
            arrowStyle.transform = 'rotate(0deg)';
        }


        // 横向位置 Horizontal position
        if(x >= ww - (ew / 2 + edgeDistance) * remRatioPx){
            // 单词位置靠右边框
            style.left = `calc(${ww}px - ${ew}em - ${edgeDistance}em)`;
            arrowStyle.left = `calc(${x - ww}px + ${ew + edgeDistance - aw / 2}em)`;
        }else if(x <= (ew / 2 + edgeDistance) * remRatioPx){
            // 单词位置靠左边框
            style.left = `${edgeDistance}em`;
            arrowStyle.left = `calc(${x}px - ${edgeDistance + aw / 2}em)`;
        }else{
            // 中间
            style.left = `calc(${x}px - ${ew / 2}em)`;
            arrowStyle.left = `${ew / 2 - aw / 2}em`;
        }
        
        // zoom

        style.fontSize = `${1 + this.state.zoom}rem`;

        return {style,arrowStyle,x,y};
  
    }

    // 跨域，服务器不支持
    iciba(){
        /**服务器不支持CORS,导致访问失败 */
        let key = "";
        const url = `http://dict-co.iciba.com/api/dictionary.php?type=json&key=${key}&w=${this.state.data.word}`;
        let myRequest = new XMLHttpRequest(false,true);
        myRequest.open("GET",url);
        myRequest.withCredentials = false;
        myRequest.setRequestHeader('Content-Type','text/plain')
        // myRequest.onreadystatechange = function(){
        //     if(myRequest.readyState === XMLHttpRequest.DONE && myRequest.status === 200){
        //         console.log("response", myRequest.responseText);
        //     }
        // }
        myRequest.send();

    }

    aliIciba(){
        let w = this.props.clickedWord.word.toLowerCase();
        if(this.state.data.word == w) return ;
        // let url = `https://1773134661611650.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/WordingReadingPro/iciba/?key=zysj&q=${w};`
        let url = `https://service-edwl7wbn-1258889000.sh.apigw.tencentcs.com/test/iciba_tr?key=zysj&q=${w}`;
        let myRequest = new XMLHttpRequest(false,true);
        let my = this;
        myRequest.open("GET",url);
        myRequest.withCredentials = false;
        // myRequest.setRequestHeader('Referer','');
        myRequest.onreadystatechange = function(){
            if(myRequest.readyState === XMLHttpRequest.DONE && myRequest.status === 200){
                let responseText = myRequest.responseText;
                let json = JSON.parse(responseText);
                console.log("response", json);
                my.icibaParseData(json);
            }else{

            }
        }

        myRequest.send();

    }

    // 云函数中转测试
    requestTest(){
        let myRequest = new XMLHttpRequest(false,true);
        let url = "https://en.wikipedia.org/wiki/Charles_H._Stonestreet";
        url = encodeURIComponent(url);
        myRequest.open("GET",`https://1773134661611650.ap-northeast-1.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${url})`);
        myRequest.onreadystatechange = function(){
            if(myRequest.readyState === XMLHttpRequest.DONE && myRequest.status === 200){
                let responseText = myRequest.responseText;
                // let json = JSON.parse(responseText); 
                console.log("response",responseText );
            }else{

            }
        }
        myRequest.send()
    }

    icibaParseData(json){
        let data = {};
        data.word = this.props.clickedWord.word.toLowerCase();
        data.moreWord = [];
        if(Object.keys(json).includes('word_name')){
            data.audio = json.symbols[0].ph_tts_mp3;
            data.audioUK = json.symbols[0].ph_en_mp3;
            data.audioUS = json.symbols[0].ph_am_mp3;
            // data.expain = json.symbols[0].parts.map(o=>o.part + o.means.join(' ')).join('\n');
            data.expain = json.symbols[0].parts.map(o=><dt><span style={{color:"#666"}}>{o.part + ' '}</span>{o.means.join(' ')}</dt>);
            // data.moreWord = json.exchange.word_pl;

            // 提取单词解释里的单词
            let more = json.symbols[0].parts.map(i=>i.means.join(' ')).join(' ').match(/[a-zA-Z]{3,20}/);
            if(more) data.moreWord.push(more[0]);
        }
        
        // data.moreWord = ['word','most','many'];
        console.log('parsed data', data);
        this.setState({
            data:data
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
        }else{
            menu.isShow = true;
            menu.style = {right:'0em',opacity:1};
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
                    if(zoom > 0.5) zoom = 0.5;
                    if(zoom < -0.5) zoom = -0.5;
                    console.log('zoom', zoom)
                    this.setState({
                        zoom:zoom
                    });
                    break;
        }
    }

    componentDidMount(){
        // this.renderArrow()
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
                    <img className="title-audio" style={autoPlay[0]?playingStyle:{}} src={audio_icon}></img>
                    <audio id="a-us" src={data.audioUS} autoPlay={autoPlay[0]}></audio>
                </div>
            )
        }

        if(data.audioUK){
            audioList.push(
                <div className="title-tts" onClick={()=>document.getElementById("a-uk").play()}>
                    <div className="" >UK</div>
                    <img className="title-audio" style={autoPlay[1]?playingStyle:{}} src={audio_icon}></img>
                    <audio id="a-uk" src={data.audioUK} autoPlay={autoPlay[1]}></audio>
                </div>
            )
        }

        if(audioList.length == 0 && data.audio){
            audioList.push(
                <div className="title-tts"  onClick={()=>document.getElementById("a-tts").play()}>
                    <img className="title-audio" style={autoPlay[2]?playingStyle:{}} src={audio_icon}></img>
                    <audio id="a-tts" src={data.audio} autoPlay={autoPlay[2]}></audio>
                </div>
            )
        }

        return audioList;
    }

    more(data){
        let moreList = [];
        let packList = [];
        if(!data.moreWord) return moreList;
        for(let i=0; i < data.moreWord.length; i++){
            if(i == 0){
                moreList.push(
                    <span className="more-word">{data.moreWord[i]}</span> 
                );
            }else{
                packList.push(
                    <span className="more-word">{data.moreWord[i]}</span> 
                );
            }
        }
        console.log('moreList', moreList, moreList.length)
        if (packList.length > 0){
            moreList.unshift(
                <img className="more-open" src={open_icon}></img>
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

        let positionStyle = {
            style:{
                "width":"17em",
                "height":"8em",
                "borderRadius":"6px",
                "backgroundColor":"#fff",
                "boxShadow":"1px 1px 5px rgba(0,0,0,0.3)",
                "position":"absolute"
            },
            arrowStyle:{
                "position":"absolute",
                "width":"2em",
                "height":"2em",
                // "top":"-1.9em"
            },
            x:0, // test
            y:0      // test
        }

        let isShow = this.props.show;
        let data = this.state.data;
        let audio = [];
        let more = [];


        // this.iciba()
        // let img = require("./res/explainBoxArrow.svg");

        if(Object.keys(this.props.clickedWord).includes('word')){
            this.aliIciba();
            positionStyle = this.calcArrowPostion(positionStyle, this.props.clickedWord.position);
            if(this.props.clickedWord.word.toLowerCase() != this.state.data.word) data = {};
            more = this.more(data);
            audio = this.audio(data);
        }



        let test = {
            top:`${positionStyle.y}px`,
            left:`${positionStyle.x}px`,
            position:"fixed",
            backgroundColor:"#f00",
            width:"3px",
            height:"3px"
        }


        // <img className="arrow" style={position.arrowStyle} src={arrow}></img>
        // <svg className="arrow" style={position.arrowStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 143"><defs></defs><polygon  style={{fill:"#fff"}} points="7 143 67.5 16 128 143 7 143"/></svg>
        
        

        return (
            <div className={`explain-panel ${isShow?'':'explain-hidden'}`} style={positionStyle.style}>
                <div style={test}></div>
                <img className="wrp-ep-arrow" style={positionStyle.arrowStyle} src={arrowShadow_icon}></img>
                <svg className="wrp-ep-arrow" style={positionStyle.arrowStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 143"><defs></defs><polygon  style={{fill:"#fff"}} points="7 143 67.5 16 128 143 7 143"/></svg>

                <div className="wrp-ep-title">
                    <div className="title-left">
                        <h1 className="title-word" style={{fontSize:`${this.calcFontSize(1.2, 11, this.props.clickedWord.word)}em`}}>{this.props.clickedWord.word}</h1>
                        {audio}
                    </div>
                    <div>
                        <img className="title-button" hidden src={star_icon}></img>
                        <img className="title-button" onClick={()=>{this.handleClickMenu()}} src={menu_icon}></img>
                    </div>
                </div>

                <div className="wrp-ep-content">
                    <dl>
                        {data.expain}
                    </dl>
                    <div className="more-word-contanier" onClick={()=>this.handleClickMore()}>
                        {more}
                    </div>
                    <div className="wrp-ep-menu" style={this.state.menu.style}>
                        <div>
                            <span>Auto Speech</span>
                            <Switch status={this.state.autoPlay} switchChange={(status)=>this.handleSetting('autoPlay',status)}></Switch>
                        </div>
                        <div>
                            <span>Speech US</span>
                            <Switch status={this.state.playUS} switchChange={(status)=>this.handleSetting('playUS',status)}></Switch>
                        </div>
                        <svg t="1579089713434" className="menu-button" onClick={()=>this.handleSetting('zoom',0.1)} viewBox="0 0 1024 1024" version="1.1" p-id="2685" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-128 0 0-128c0-19.2-12.8-32-32-32s-32 12.8-32 32l0 128-128 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l128 0 0 128c0 19.2 12.8 32 32 32s32-12.8 32-32l0-128 128 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2686"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2687"></path></svg>
                        <svg t="1579089707234" className="menu-button" onClick={()=>this.handleSetting('zoom',-0.1)} viewBox="0 0 1024 1024" version="1.1" p-id="2556" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M592 400l-320 0c-19.2 0-32 12.8-32 32s12.8 32 32 32l320 0c19.2 0 32-12.8 32-32S611.2 400 592 400z" p-id="2557"></path><path d="M950.4 905.6l-236.8-236.8c54.4-64 86.4-147.2 86.4-236.8C800 227.2 636.8 64 432 64 227.2 64 64 227.2 64 432 64 636.8 227.2 800 432 800c89.6 0 172.8-32 236.8-86.4l236.8 236.8c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6C963.2 937.6 963.2 918.4 950.4 905.6zM432 736C265.6 736 128 598.4 128 432 128 265.6 265.6 128 432 128c166.4 0 304 137.6 304 304C736 598.4 598.4 736 432 736z" p-id="2558"></path></svg>
                    </div>
                </div>              
            </div>
        )
    }
}


export default ExpainPanel;