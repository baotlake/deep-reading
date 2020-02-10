import React from 'react';

class A extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };

    }

    handleClick(e){
        console.log('A handleClick', e.currentTarget);
        // 阻止默认事件
        e.preventDefault();

        try{
            this.props.handleClick(e.currentTarget.href, true);
        }catch(e){
            console.error('a.js need props.handleClick function!', e);
        }

    }

    render(){
        let props = this.props.props;
        props = Object.assign(props, {target:'_blank'});

        return (
            <a {...this.props.props}
                onClick={(e)=>this.handleClick(e)}
                style={{color:'blue'}}
            >{this.props.children}</a>
        );
    }
}

export default A;