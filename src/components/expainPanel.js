import React from "react";

class ExpainPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    calcArrowPostion(position){
        // 返回style={}, x,y 为箭头中心点
        //window.width, window.height
        let x = position.x, y= position.y;
        let ww = 500,wh= 500;
        let style =  position.style;
        let arrowStyle = position.arrowStyle;
        let aw = parseFloat(arrowStyle.width);

        let ew = parseFloat(style.width), eh = parseFloat(style.height);
        const topDistance = 20;         //rem 顶部距离小于20时,expainPanel显示在单词下方
        const wordDistance = 3;         //rem expainPanel距离单词的距离
        const edgeDistance = 1;         //rem 左右边距

        let remRatioPx = 16;            // 1 rem = 16 px

        // x 不能小于18,不能大于 ww - 18, 否则箭头和框出现分离, 下面两行代码矫正
        // if(x < 18) x = 18;
        // if(x > ww - 18) x = ww - 18;

        //纵向位置 Vertical position
        if(y >= topDistance * remRatioPx){
            // expainPanel显示在单词上方
            style.top = `calc(${y}px - ${eh}rem - ${wordDistance}rem)`;
            arrowStyle.transform = 'rotate(180deg)'
            arrowStyle.top = `${eh}rem`
        }else{
            // expainPanel显示在单词下方
            style.top = `calc(${y}px + ${wordDistance}rem)`;
            arrowStyle.top = `-${arrowStyle.height}`
            arrowStyle.transform = 'rotate(0deg)'
        }


        // 横向位置 Horizontal position

        if(x >= ww - (ew / 2 + edgeDistance) * remRatioPx){
            // 单词位置靠右边框
            style.left = `calc(${ww}px - ${ew}rem - ${edgeDistance}rem)`
            arrowStyle.left = `calc(${x - ww}px + ${ew + edgeDistance - aw / 2}rem)`
        }else if(x <= (ew / 2 + edgeDistance) * remRatioPx){
            // 单词位置靠左边框
            style.left = `${edgeDistance}rem`
            arrowStyle.left = `calc(${x}px - ${edgeDistance + aw / 2}rem)`
        }else{
            // 中间
            style.left = `calc(${x}px - ${ew / 2}rem)`
            arrowStyle.left = `${ew / 2 - aw / 2}rem`
        }

        // this.setState({
        //     position:{style:style,arrowStyle:arrowStyle}
        // })

        return {style,arrowStyle,x,y}
  
    }


    render(){

        let position = {
            style:{
                "width":"16rem",
                "height":"8rem",
                "borderRadius":"6px",
                "backgroundColor":"#fff",
                "boxShadow":"0 0 15px rgba(0,0,0,0.3)",
                "position":"fixed"
            },
            arrowStyle:{
                "position":"absolute",
                "width":"2rem",
                "height":"2rem",
                "top":"-1.8rem"
            },
            x:'450', // test
            y:'10'      // test
        }

        let img = require("./res/explainBoxArrow.svg");

        position = this.calcArrowPostion(position)
        console.log('potioin',position)

        let test = {
            top:`${position.y}px`,
            left:`${position.x}px`,
            position:"fixed",
            backgroundColor:"#f00",
            width:"3px",
            height:"3px"
        }

        return (
            <div style={position.style}>
                <img style={position.arrowStyle} src={img}></img>
                <div>{this.props.test}</div>
                <div style={test}></div>
            </div>
        )
    }
}


export default ExpainPanel;