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
    }

    handleClick(w, e){
        console.log("click e->", e, e.clientX, e.clientY)
        this.props.handleClick(w,{x:e.clientX, y:e.clientY})
        this.setState({
            style:{
                "backgroundColor":"#fff",
                "borderRadius":"5px"
            }
        })
    }

    handleTest(w, e){
        console.log("click e->", e, e.clientX, e.clientY)
        this.props.handleClick(`test 【${w}】`, {x:e.clientX, y:e.clientY})
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
                onClick={(e)=>this.handleClick(this.props.content,e)}
                onWheel={(e)=>this.props.translate(e)}
                // onTouchMove={(e)=>this.handleTest(this.props.content,e)}
                style={this.state.style}
            >{this.props.content}</span>
        )
    }

}

export default word;