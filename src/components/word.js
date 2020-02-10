import React from 'react';
import { getKeys } from 'eslint-visitor-keys';

var key = 0;
function getMyKeys(){
    key += 1
    return key.toString()
}

class word extends React.Component{
    constructor(props){
        super(props);
        this.state={
            style:{}
        }
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
        let w = e.currentTarget.textContent;
        try{
            this.props.handleClick(w,{x:e.pageX, y:e.pageY, clientY:e.clientY})
        }catch(e){
            console.warn("word: props.hanleClick is not function!", e)
        }
        this.setState({
            style:{
                "backgroundColor":"rgba(255,255,255,0.3)",
                "borderRadius":"5px"
            }
        })
        // 阻止冒泡可能会导致点击链接无效
        // e.stopPropagation()
    }

    handleTouchMove(e){
        // console.log('touchMove',e,e.touches,e.targetTouches)
        console.log(e.touches[0].pageX, e.touches[0].pageY, this.touchMoving)
        if(!this.touchMoving){
            // 触摸开始
            this.touchMoving = true;
            setTimeout((that)=>{
                that.touchMoving = false;
                console.log('time up', this.touchMoving)
            }, 300, this);
            // 记录初始化
            this.movingRecord = {
                sumX:0,
                sumY:0,
                lastX:e.touches[0].pageX,
                lastY:e.touches[0].pageY
            }
        }else{
            // 滑动中 记录
            this.movingRecord.sumX = this.movingRecord.sumX + e.touches[0].pageX - this.movingRecord.lastX;
            this.movingRecord.sumY = this.movingRecord.sumY + e.touches[0].pageY - this.movingRecord.lastY;
            this.movingRecord.lastX = e.touches[0].pageX;
            this.movingRecord.lastY = e.touches[0].pageY;
        }

        // 滑动 判断
        if(Math.abs(this.movingRecord.sumX) > 50 && Math.abs(this.movingRecord.sumY) < 20){
            // 成立
            console.log("translate")
            try{
                this.props.translate(e)
            }catch(e){
                console.warn("word: props.translate is not function!", e);
            }
        }

    }

    handleDoubleClick(e){
        console.log('double click')
        try{
            this.props.translate(e)
        }catch(e){
            console.warn("word: props.translate is not function!", e);
        }
    }

    handleTest(w, e){
        console.log("click e->", e, e.clientX, e.clientY)
        this.setState({
            style:{
                "backgroundColor":"#fff",
                "borderRadius":"5px"
            }
        })
    }

    render(){
        let key = getMyKeys()
        return (
            <span
                key={key}
                id={key}
                className="@w"
                onClick={(e)=>this.handleClick(e)}
                onTouchMove={(e)=>this.handleTouchMove(e)}
                onMousedown={(e)=>this.handleDoubleClick(e)}
                style={this.state.style}
            >{this.props.content}</span>
        )
    }

}

export default word;