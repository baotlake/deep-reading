import React from "react";
import './readPanel.css';

import Switch from './switch.js';

class ReadPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            menuPosition:{
                top:0,
                left:0,
                opacity:0,
                pointerEvents:'none',
            },

        }
        this.touchStartDate = 0;
        this.rpMenu = {w:60,h:200};
        this.touchTarget = null;

        this.touchMoving = false;
        this.movingRecord = {
            sumX:0,
            sumY:0,
            lastX:0,
            lastY:0
        }
    }

    handleClick(e){
        // console.log("click e->", e,e.pageX,e.pageY, e.clientX, e.clientY)

        // console.log('e ->', e,e.target, e.currentTarget,e.detail, window.getSelection())

        // console.log('window', window.getSelection())
        let anchorNode = window.getSelection().anchorNode && window.getSelection().anchorNode.parentElement;
        if(anchorNode == e.target){
            try{
                this.props.handleClick(e);
            }catch(e){
                console.warn("readPanel.js need props.hanleClick function!", e)
            }
        }else{
            try{
                this.props.hiddenSomeone('explainPanel linkDialog');
            }catch(e){
                console.warn("readPanel.js need props.hiddenSomeone function!", e)
            }
        }
        
        
        // e.stopPropagation()
    }

    handleTouchStart(e){
        this.touchStartDate = new Date();
        // console.log('touchstart',e,e.target)
        // 记录初始化
        this.movingRecord = {
            sumX:0,
            sumY:0,
            lastX:e.touches[0].pageX,
            lastY:e.touches[0].clientY
        }
    }

    handleTouchEnd(e){
        this.touchMoving = false;
        // 滑动 判断
        if(Math.abs(this.movingRecord.sumX) > 50 && Math.abs(this.movingRecord.sumY) < 15){
            // 成立
            try{
                this.props.translate(e)
            }catch(e){
                console.warn("word: props.translate is not function!", e);
            }
        }

        let touchTime = (new Date()) - this.touchStartDate;
        console.log('record', this.movingRecord.sumX,this.movingRecord.sumY )
        let touchMove = Math.abs(this.movingRecord.sumX) < 15 && Math.abs(this.movingRecord.sumY) < 15;
        if(touchTime > 300 && touchTime < 2000 && touchMove){
            e.preventDefault();
            e.stopPropagation();

            console.log('Touch', e, e.changedTouches, e.targetTouches, e.view, e.touches, e.target)
            let x = e.changedTouches[0].clientX;
            let y = e.changedTouches[0].clientY;
            let vw = window.screen.availWidth;
            let vh = window.screen.availHeight;
            let marg = 8;
            let position = Object.assign({},this.state.menuPosition);

            if((x + this.rpMenu.w) > vw) x = vw - this.rpMenu.w - marg;
            if((y + this.rpMenu.h) > vh) y = vh - this.rpMenu.h - marg;

            position.top = y;
            position.left = x;
            position.opacity = '1';
            position.pointerEvents = 'all';

            this.setState({
                menuPosition:position
            })
            this.touchTarget = e.target;
        }
    }

    handleTouchMove(e){
        // console.log('touchMove',e,e.touches,e.targetTouches)
        // console.log(e.touches[0].pageX, e.touches[0].pageY, this.touchMoving)
        if(!this.touchMoving){
            // 触摸开始
            this.touchMoving = true;
            let self = this;
            // setTimeout(()=>{
            //     self.touchMoving = false;
            //     // console.log('time up', this.touchMoving)
            // }, 100, this);
            // 记录初始化
            this.movingRecord = {
                sumX:0,
                sumY:0,
                lastX:e.touches[0].pageX,
                lastY:e.touches[0].clientY
            }
        }else{
            // 滑动中 记录
            this.movingRecord.sumX = this.movingRecord.sumX + e.touches[0].pageX - this.movingRecord.lastX;
            this.movingRecord.sumY = this.movingRecord.sumY + e.touches[0].clientY - this.movingRecord.lastY;
            this.movingRecord.lastX = e.touches[0].pageX;
            this.movingRecord.lastY = e.touches[0].clientY;
        }
    }

    handleCloseRpMenu(){
        let position = Object.assign({},this.state.menuPosition);
        position.opacity = '0';
        position.pointerEvents = 'none';

        this.setState({
            menuPosition:position
        })
    }

    handleRpHidden(){
        if(!this.touchTarget) return;
        if(this.touchTarget.className.split(' ').includes('wrp-read-panel')) return;
        this.touchTarget.classList.add('wrp-rp-hidden');
        this.handleCloseRpMenu();
    }

    handleRpRemove(){
        if(!this.touchTarget) return;
        if(this.touchTarget.className.split(' ').includes('wrp-read-panel')) return;
        this.touchTarget.classList.add('wrp-rp-remove');
        this.handleCloseRpMenu();
    }

    handleRpShow(){
        let hiddenList = document.getElementsByClassName('wrp-rp-hidden');
        console.log('hiddenList', hiddenList.length)
        for(let i = hiddenList.length - 1; i >= 0; i--){
            console.log('show ->',i,hiddenList.length)
            let element = hiddenList[i];
            element.classList.remove('wrp-rp-hidden');
            // break;
        }
        this.handleCloseRpMenu();
    }

    componentDidMount(){
        let rm = document.getElementById('wrp-rp-menu');
        this.rpMenu.w = rm.offsetWidth;
        this.rpMenu.h = rm.offsetHeight;
    }

    render(){

        let style = {};
        if(this.props.padding) style.padding = '1em';


        return (
            <div 
                id="wrp-read-panel" 
                style={style}
                onClick={(e)=>this.handleClick(e)}
                onTouchStart={(e)=>this.handleTouchStart(e)}
                onTouchEnd={(e)=>this.handleTouchEnd(e)}
                onTouchMove={(e)=>this.handleTouchMove(e)}

            >
                {this.props.content}

                <div id="wrp-rp-menu" style={this.state.menuPosition}>
                    <div className="wrp-nav-item" onClick={()=>this.handleCloseRpMenu()}>
                        <svg className="wrp-nav-item-icon" fill='var(--t-fore-c)' viewBox="0 0 1024 1024" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M877.216 491.808M575.328 510.496 946.784 140.672c17.568-17.504 17.664-45.824 0.192-63.424-17.504-17.632-45.792-17.664-63.36-0.192L512.032 446.944 143.712 77.216C126.304 59.712 97.92 59.648 80.384 77.12 62.848 94.624 62.816 123.008 80.288 140.576l368.224 369.632L77.216 879.808c-17.568 17.504-17.664 45.824-0.192 63.424 8.736 8.8 20.256 13.216 31.776 13.216 11.424 0 22.848-4.352 31.584-13.056l371.36-369.696 371.68 373.088C892.192 955.616 903.68 960 915.168 960c11.456 0 22.912-4.384 31.648-13.088 17.504-17.504 17.568-45.824 0.096-63.392L575.328 510.496 575.328 510.496zM575.328 510.496" p-id="10091"></path></svg>
                        <div className="wrp-nav-item-title"></div>
                    </div>
                    <div className="wrp-nav-item" onClick={()=>this.handleRpHidden()}>
                        <svg className="wrp-nav-item-icon" fill='var(--t-fore-c)' viewBox="0 0 1024 1024" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M947.6 477.2c-85-106-175.9-177.5-272.8-214.7l60.1-122.3c8.8-17.8 1.4-39.5-16.4-48.2-17.8-8.8-39.5-1.4-48.2 16.4l-65.6 133.4c-30.4-6.4-61.3-9.6-92.7-9.6-159.3 0-304.5 81.7-435.6 245-8.3 10.2-12.4 22.6-12.4 35s4.1 24.8 12.3 35.1C161.3 653.2 252.2 724.7 349 762l-59.9 121.9c-8.8 17.8-1.4 39.5 16.4 48.2s39.5 1.3 48.2-16.4l65.3-133c30.4 6.4 61.4 9.6 93 9.6 159.3 0 304.5-81.7 435.6-245 16.4-20.5 16.4-49.7 0-70.1z m-799.1 35c112.4-140 232.8-207.8 363.5-207.8 20.1 0 39.9 1.6 59.6 4.8L544.7 364c-10.5-2.3-21.5-3.5-32.7-3.5-83.8 0-151.8 68-151.8 151.8 0 46.7 21.1 88.5 54.4 116.4L381.4 696c-81.5-30.8-159-91.7-232.9-183.8z m443.3 0c0 43.8-35.3 79.4-79 79.8l62.9-127.9c10.1 13.4 16.1 30.1 16.1 48.1z m-159.6 0c0-43.8 35.2-79.2 78.8-79.8l-62.8 127.8c-10.1-13.3-16-29.9-16-48zM512 720c-20.2 0-40.1-1.6-59.7-4.9l26.9-54.7c10.6 2.3 21.6 3.6 32.8 3.6 83.8 0 151.8-68 151.8-151.8 0-46.8-21.2-88.6-54.5-116.5l33.1-67.4C724 359.1 801.5 420 875.5 512.2 763.1 652.2 642.6 720 512 720z" p-id="7888"></path></svg>
                        <div className="wrp-nav-item-title">隐藏</div>
                    </div>
                    <div className="wrp-nav-item" onClick={()=>this.handleRpRemove()}>
                        <svg className="wrp-nav-item-icon" fill='var(--t-fore-c)' viewBox="0 0 1024 1024" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M668.8 896h-320c-48.64 0-88.32-37.76-92.8-87.68L211.2 403.2c-1.92-17.28 10.88-33.28 28.16-35.2 17.28-1.92 33.28 10.88 35.2 28.16l44.16 405.76c1.28 17.28 14.08 30.08 28.8 30.08h320c14.72 0 27.52-12.8 28.8-29.44l44.16-406.4c1.92-17.28 17.92-30.08 35.2-28.16 17.28 1.92 30.08 17.92 28.16 35.2l-44.16 405.76c-2.56 49.28-42.88 87.04-90.88 87.04zM826.24 321.28H190.72c-17.92 0-32-14.08-32-32s14.08-32 32-32h636.16c17.92 0 32 14.08 32 32s-14.72 32-32.64 32z" p-id="13417"></path><path d="M424.96 789.12c-16.64 0-30.72-12.8-32-29.44l-27.52-347.52c-1.28-17.92 11.52-33.28 29.44-34.56 17.92-1.28 33.28 11.52 34.56 29.44l27.52 347.52c1.28 17.92-11.52 33.28-29.44 34.56h-2.56zM580.48 789.12h-2.56c-17.92-1.28-30.72-16.64-29.44-34.56L576 407.04c1.28-17.92 16.64-30.72 34.56-29.44 17.92 1.28 30.72 16.64 29.44 34.56l-27.52 347.52c-1.92 16.64-15.36 29.44-32 29.44zM581.76 244.48c-17.92 0-32-14.08-32-32 0-23.68-19.2-43.52-43.52-43.52s-43.52 19.2-43.52 43.52c0 17.92-14.08 32-32 32s-32-14.08-32-32c0-59.52 48-107.52 107.52-107.52s107.52 48 107.52 107.52c0 17.28-14.08 32-32 32z" p-id="13418"></path></svg>
                        <div className="wrp-nav-item-title">移除</div>
                    </div>
                    <div className="wrp-nav-item" 
                        onClick={()=>this.handleRpShow()}
                    >
                        <svg className="wrp-nav-item-icon" fill='var(--t-fore-c)' viewBox="0 0 1024 1024" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M512.14 819c-136.83 0-253.2-59.32-326.73-109.08C97.84 650.6 35.29 581.25 12.15 538.82a56.53 56.53 0 0 1 0-54.35c23.14-42.44 85.69-111.79 173.26-171 73.53-49.77 189.9-109.09 326.73-109.09 137.53 0 253.1 57.92 325.84 106.51 40.4 27 78.56 58.49 110.35 91.12 28.79 29.53 51.46 59.18 63.84 83.48a57.94 57.94 0 0 1 0 52.4c-12.38 24.3-35 53.95-63.84 83.48-31.79 32.63-70 64.14-110.35 91.13C765.24 761 649.67 819 512.14 819zM67 511.64c10 17.43 28.73 40.66 51.89 64.2a672.78 672.78 0 0 0 100.8 83.41c66.45 45 171.14 98.59 292.48 98.59 122.21 0 226.18-52.32 291.89-96.21 78.53-52.46 133.92-114.07 152.88-150-19-35.92-74.35-97.53-152.88-150-65.71-43.89-169.68-96.21-291.89-96.21-121.34 0-226 53.61-292.48 98.59a672.23 672.23 0 0 0-100.8 83.42C95.7 471 76.93 494.21 67 511.64z" fill="#333333" p-id="8662"></path><path d="M511.81 682.86c-94.41 0-171.22-76.81-171.22-171.22s76.81-171.22 171.22-171.22S683 417.23 683 511.64s-76.78 171.22-171.19 171.22z m0-278.44A107.22 107.22 0 1 0 619 511.64a107.34 107.34 0 0 0-107.19-107.22z" fill="#333333" p-id="8663"></path></svg>
                        <div className="wrp-nav-item-title">显示</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReadPanel;