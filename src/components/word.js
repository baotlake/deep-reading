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


    handleTouchMove(e){
        // console.log('touchMove',e,e.touches,e.targetTouches)
        // console.log(e.touches[0].pageX, e.touches[0].pageY, this.touchMoving)
        if(!this.touchMoving){
            // 触摸开始
            this.touchMoving = true;
            let self = this;
            setTimeout(()=>{
                self.touchMoving = false;
                // console.log('time up', this.touchMoving)
            }, 100, this);
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
        if(Math.abs(this.movingRecord.sumX) > 50 && Math.abs(this.movingRecord.sumY) < 15){
            // 成立
            // console.log("translate")
            try{
                this.props.translate(e)
            }catch(e){
                console.warn("word: props.translate is not function!", e);
            }
        }

    }

    handleMouseMove(e){
        // console.log('handleMouseMove', this.touchMoving);
        if(this.touchMoving){
            // console.log('handleMouseMove', e)
        }
    }

    handleMouseDown(e){
        this.touchMoving = true;
    }

    handleMouseUp(e){
        this.touchMoving = false;
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
                // onTouchMove={(e)=>this.handleTouchMove(e)}
                // onMouseDown={(e)=>this.handleMouseDown(e)}
                // onMouseMove={(e)=>this.handleMouseMove(e)}
                // onMouseUp={(e)=>this.handleMouseUp(e)}
                // style={this.state.style}
            >{this.props.content}</span>
        )
    }

}

export default word;