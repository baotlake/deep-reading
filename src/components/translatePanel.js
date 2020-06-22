import React from 'react';
import Word from './word.js';

import { renderToString } from "react-dom/server";

// import { isS } from 'xmlchars/xml/1.0/ed5';

import './translatePanel.css';

// 放到TranslatePanel 哪里合适
var translateScope={
    front:1,    //设定值
    behind:1,   //设定值
    nf:0,       //当前值
    nb:0        //当前值
}

class TranslatePanel extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showStatus:'hidden',
            movingStyle:{},
            status:'0',
        }
        this.data = {};
        this.movingRecord = {
            sumY:0,
            lastY:0,
            moving:false,
            slipY:0,
            slipNum:0,
        };
        this.tpHeight = 550;
        this.count = 0;
    }


    handleTouchMove(e){
        // console.log(e)
        e.preventDefault();
        e.stopPropagation();

        if(this.movingRecord.moving == false){
            this.movingRecord.lastY = e.touches[0].clientY;
            this.movingRecord.moving = true;
            setTimeout(()=>this.movingRecord.moving = false, 200);
        }else{
            
            this.movingRecord.sumY = this.movingRecord.sumY + e.touches[0].clientY - this.movingRecord.lastY;

            this.movingRecord.lastY = e.touches[0].clientY;

            if(this.state.showStatus == "full"){
                if(this.movingRecord.sumY < 0) this.movingRecord.sumY = 0;
                if(this.movingRecord.sumY > this.tpHeight - 100) this.movingRecord.sumY = this.tpHeight - 100;
            }else if(this.state.showStatus == "half"){
                if(this.movingRecord.sumY < - this.tpHeight / 2) this.movingRecord.sumY = -this.tpHeight / 2;
                if(this.movingRecord.sumY > (this.tpHeigth / 2 - 100)) this.movingRecord.sumY = this.tpHeight / 2 - 100;
            }

            this.setTranslateY(this.movingRecord.sumY);
        }
    }

    handleTouchSlip(e){
        // console.log('touch slip')
        e.stopPropagation();
        if(this.movingRecord.moving == false){
            this.movingRecord.lastY = e.touches[0].clientY;
            this.movingRecord.slipY = 0;
            this.movingRecord.moving = true;
            setTimeout(()=>{
                this.movingRecord.moving = false;
                this.slipNum = 0;
            }, 150);
        }else{
            this.movingRecord.slipY = this.movingRecord.slipY + e.touches[0].clientY - this.movingRecord.lastY;
            
            let status = 0;
            if(this.state.showStatus == "half"){
                status = 1;
            }else if(this.state.showStatus == "full"){
                status = 2;
            }

            if(this.movingRecord.slipY > 100 && this.slipNum == 0){
                status = status - 1;
                this.movingRecord.slipY = 0;
                this.slipNum = 1;
            }else if(this.movingRecord.slipY < -100 && this.slipNum == 0){
                status = status + 1;
                this.movingRecord.slipY = 0;
                this.slipNum = 1;
            }

            if(status < 0)status = 0;
            if(status > 2)status = 2;
            let showStatus = ['hidden', 'half', 'full'][status];
            // console.log('status', status, this.movingRecord.slipY);

            if(this.state.showStatus == showStatus) return;

            this.setState({
                showStatus:showStatus
            })

            // let tp = document.getElementById("tp"); 
            // tp.style.transform = style.transform;
        }
    }

    setTranslateY(value){
        let style = {transform:`translateY(${value}px)`}
        // console.log('set translate y', value);
        let tp = document.getElementById("tp");
        if(!tp) {
            console.log('tp x');
            return;
        };
        tp.style.transform = style.transform;
    }

    test(e){
        console.log(e)
        e.preventDefault();

    }

    handleMouseMove(e){
        console.log('mouse move ->', this.movingRecord.moving,e)
        
        if(this.movingRecord.moving == true){
            
            this.movingRecord.slipY = this.movingRecord.slipY + e.clientY - this.movingRecord.lastY;
            
            let status = 0;
            if(this.state.showStatus == "half"){
                status = 1;
            }else if(this.state.showStatus == "full"){
                status = 2;
            }

            if(this.movingRecord.slipY > 100 && this.slipNum == 0){
                status = status - 1;
                this.movingRecord.slipY = 0;
                this.slipNum = 1;
            }else if(this.movingRecord.slipY < -100 && this.slipNum == 0){
                status = status + 1;
                this.movingRecord.slipY = 0;
                this.slipNum = 1;
            }

            if(status < 0)status = 0;
            if(status > 2)status = 2;
            let showStatus = ['hidden', 'half', 'full'][status];
            // console.log('status', status, this.movingRecord.slipY);

            if(this.state.showStatus == showStatus) return;

            this.setState({
                showStatus:showStatus
            })

            // let tp = document.getElementById("tp"); 
            // tp.style.transform = style.transform;
        }
        
    }

    handleMouseDown(e){
        this.movingRecord.moving = true;
    }

    handleMouseUp(e){
        this.movingRecord.moving = false;
        this.slipNum = 0;
    }

    handleMouseLeave(e){
        this.movingRecord.moving = false;
        this.slipNum = 0;
    }

    translate(){
        // let url = "http://192.168.1.14:8000/translate";
        let url = "http://47.94.145.177:8000/translate";
        var xhr = new XMLHttpRequest(false,true);
        xhr.open("POST", url, true );
        xhr.withCredentials = false;
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.onreadystatechange = ()=>{}
        let self = this;
        xhr.onload = function(){
            let json = JSON.parse(xhr.responseText);
            if(json.status == '1'){
                self.data.translate = json.value;
                self.setState({
                    status:'1'
                })
                // console.log('data', self.data)
            }
        }

        let text = this.props.translateText && this.props.translateText.text;

        xhr.send(`text=${encodeURIComponent(text)}&lang=${encodeURIComponent('en')}`);

    }

    getTextContent(element){
        
    }

    componentDidMount(){
        let tp = document.getElementById('tp');
        tp.addEventListener('touchmove', (e)=>e.preventDefault());
        this.tpHeight = tp.offsetHeight;

    }

    render(){

        let count = this.props.translateCount;
        if(this.count != count){
            // console.log('extract',targetId, this.targetId);
            this.setState({
                showStatus:'half',
                status:0,
            })
            this.translate();
            this.movingRecord.sumY = 0;
            this.setTranslateY(0);
            this.count = count;

        }
        // if(this.state.showStatus == 'hidden') this.targetId = null;

        let showStyle={
            hidden:{
                bottom:"-85%",
                height:'80%',
            },
            half:{
                bottom:"-45%",
                height:'80%',
            },
            full:{
                bottom:0,
                height:'80%',
            }
        }

        let panelStyle = Object.assign({}, showStyle[this.state.showStatus]);

        return (
            <div id="tp" className="wrp-translate-panel" style={panelStyle}
                onTouchMove={(e)=>this.handleTouchSlip(e)}
                onMouseMove={(e)=>this.handleMouseMove(e)}
                onMouseDown={(e)=>this.handleMouseDown(e)}
                onMouseUp={(e)=>this.handleMouseUp(e)}
                onMouseLeave={(e)=>this.handleMouseLeave(e)}
                onClick={(e)=>this.props.clickWord(e)}
            >
                <div className="wrp-tp-handle" onTouchMove={(e)=>this.handleTouchMove(e)} />

                <div className="">{this.props.translateText.elements}</div>
                <div className="">
                    {(this.state.status == '1')?this.data.translate:''}
                </div>

            </div>
        )
    }
}

export default TranslatePanel;