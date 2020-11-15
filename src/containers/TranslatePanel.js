import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash'

import * as explActions from '../actions/explanation';
import * as translateActions from '../actions/translate';

import Word from '../components/word.js';
// import TranslatePanel from '../components/TranslatePanel'

// import { renderToString } from "react-dom/server";

import '../components/translatePanel.scss';

// 放到TranslatePanel 哪里合适
var translateScope={
    front:1,    //设定值
    behind:1,   //设定值
    nf:0,       //当前值
    nb:0        //当前值
}

const touchRecord = {
    lastY:0,
    moving:false,
    slipY:0,
    slipNum:0,
}

class TranslatePanel extends React.Component{
    constructor(props){
        super(props)
        this.state={
            // showStatus:'hidden',
            movingStyle:{},
            // '0' 表示隐藏 
            status:'0',
            dragY:0,
        }
        this.data = {};
        this.tpHeight = 550;
        this.count = 0;
        this.handleClick = this.handleClick.bind(this)
    }

    handleDrag(e){
        // console.log(e)
        // e.preventDefault();
        e.stopPropagation();
        if(touchRecord.moving == false) {
            touchRecord.lastY = e.touches[0].clientY;
            touchRecord.moving = true;
            setTimeout(()=>touchRecord.moving = false, 200);
            console.log('moving = true')
        }else{
            console.log('moving')
            let dragY = this.state.dragY + e.touches[0].clientY - touchRecord.lastY;

            touchRecord.lastY = e.touches[0].clientY;

            if(this.props.translate.show == "full") {
                if(dragY < 0) dragY = 0;
                if(dragY > this.tpHeight - 100) dragY = this.tpHeight - 100;
            }else if(this.props.translate.show == "half") {
                // 向上偏移值限制
                if(dragY < -this.tpHeight / 2) dragY = -this.tpHeight / 2;
                // 向下偏移值限制
                if(dragY > this.tpHeight / 5 ) dragY = this.tpHeight / 5;
                if(dragY > 150 ) dragY = 150;
            }

            this.setDrag(dragY);
        }
    }

    resetDrag(e){
        e.stopPropagation()
        this.setDrag(0)
    }

    setDrag(value){
        this.setState({
            dragY:value
        })
    }

    handleTouchSlip(e) {
        // console.log('touch slip')
        e.stopPropagation();
        if(touchRecord.moving == false){
            touchRecord.lastY = e.touches[0].clientY;
            touchRecord.slipY = 0;
            touchRecord.moving = true;
            setTimeout(()=>{
                touchRecord.moving = false;
                touchRecord.slipNum = 0;
            }, 150);
        }else{
            touchRecord.slipY = touchRecord.slipY + e.touches[0].clientY - touchRecord.lastY;
            
            let status = 0;
            if(this.props.translate.show == "half"){
                status = 1;
            }else if(this.props.translate.show == "full"){
                status = 2;
                this.setDrag(0);
            }
    
            if(touchRecord.slipY > 100 && touchRecord.slipNum == 0){
                status = status - 1;
                touchRecord.slipY = 0;
                touchRecord.slipNum = 1;
            }else if(touchRecord.slipY < -100 && touchRecord.slipNum == 0){
                status = status + 1;
                touchRecord.slipY = 0;
                touchRecord.slipNum = 1;
            }
    
            if(status < 0)status = 0;
            if(status > 2)status = 2;
            let show = ['hidden', 'half', 'full'][status];
    
            if(this.props.translate.show == show) return;
            this.props.setShow(show)
        }
    }

    handleClick(e) {
        e.stopPropagation()
        this.props.tapWord(e)
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
        // let url = "http://47.94.145.177:8000/translate";
        // let url = "https://baotlake.ink:8001/translate";
        let url = "https://1773134661611650.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/wrp/wrp_server/alimt"
        
        var xhr = new XMLHttpRequest(false,true);
        xhr.open("POST", url, true );
        xhr.withCredentials = false;
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.onreadystatechange = ()=>{}
        let self = this;
        xhr.onload = function(){
            console.log('xhr onload')
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

        let dragStyle = {
            transform:`translateY(${this.state.dragY}px)`
        }

        let show = get(this.props.translate, 'show', 'hidden')
        let panelStyle = Object.assign({}, showStyle[show], dragStyle);
        let original = this.props.translate.original || {}
        let status = this.props.translate.status
        let translation = this.props.translate.translation

        return (
            <div id="tp" className="wrp-translate-panel" style={panelStyle}
            onTouchMove={(e)=>this.handleTouchSlip(e)}
            // onMouseMove={(e)=>this.handleMouseMove(e)}
            // onMouseDown={(e)=>this.handleMouseDown(e)}
            // onMouseUp={(e)=>this.handleMouseUp(e)}
            // onMouseLeave={(e)=>this.handleMouseLeave(e)}
            onClick={this.handleClick}
        >
            <div className="wrp-tp-handle" 
                onTouchMove={(e)=>this.handleDrag(e)} 
                onClick={(e)=>this.resetDrag(e)} 
            />

            <div className="">{original.elements}</div>
            <br/>
            <div className="">
                {(status == "completed") ? translation.text :''}
            </div>

        </div>
        )
    }
}

const mapStateToProps = state => ({
    translate: state.translate
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    tapWord: event => {
        dispatch(explActions.tapWord(event))
    },
    setShow: value => {
        dispatch(translateActions.setShow(value))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslatePanel);