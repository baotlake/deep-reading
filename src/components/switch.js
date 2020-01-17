import React from 'react';

class Switch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status:false,
        };
        this.hasInit = false;
        this.switchStyle = {
            boxSizing :"border-box",
            width :'2.5em',
            height :'1.2em',
            backgroundColor:"#ccc",
            // border:"1px solid #888",
            borderRadius:'0.6em',
            display:"inline-flex",
            alignItems:"center",
            padding:"0 0.1em",
            color:'#fff',
            transition:'all 0.3s',
            verticalAlign:'middle',
            marginLeft:'0.5em',

        };
        this.dotStyle = {
            boxSizing :"border-box",
            width:"0px",
            height:"0px",
            border:"0.5em solid",
            borderRadius:'50%'
        };
        this.onStyle = {
            backgroundColor:'#0f0',
            color:"#fff",
            justifyContent:'flex-end'
        };
        this.offStyle = {
            backgroundColor:'#ccc',
            color:"#fff",
            justifyContent:'flex-start'
        };
    }

    handleClick(){
        let status = !this.state.status;
        this.setState({
            status:status
        });
        try{
            this.props.switchChange(status);
        }catch(e){
            console.warn('Switch component no incoming "props.switchChange" function.', e);
        }
    }

    init(props){
        if(props.initStatus != this.state.status && this.hasInit == false){
            this.hasInit = true;
            this.setState({
                status:props.initStatus
            });
        }
        if(props.onStyle){
            let onStyle = Object.assign({}, this.onStyle);
            Object.assign(onStyle, this.props.onStyle);
            this.onStyle = onStyle;
        };
        if(props.offStyle){
            let offStyle = Object.assign({}, this.offStyle);
            Object.assign(offStyle, this.props.offStyle);
            this.offStyle = offStyle;
        };
        if(props.switchStyle){
            let switchStyle = Object.assign({}, this.switchStyle);
            Object.assign(switchStyle, this.props.switchStyle);
            this.switchStyle = switchStyle;
        };

        if(props.status != undefined && props.status != this.state.status){
            this.setState({
                status:props.status
            })
        }
    }

    render(){

        this.init(this.props);

        let style = Object.assign({},this.switchStyle);
        // console.log('style ', style, Object.isExtensible(style), Object.isFrozen(style))
        switch(this.state.status){
            case true:
                style = Object.assign(style, this.onStyle);
                break
            case false:
                style = Object.assign(style, this.offStyle);
                break
        }

        return (
            <div style={style} onClick={()=>this.handleClick()}>
                <div style={this.dotStyle}></div>
            </div>
        );
    }

}

export default Switch;  