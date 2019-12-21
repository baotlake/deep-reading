import React from 'react';

class word extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    handleClick(test){
        this.props.handleClick(test)
    }

    render(){
        return (
            <span 
                id={'a'} 
                onClick={()=>this.handleClick(this.props.content)}
                style={{'backgroundColor':'#fff','borderRadius':'5px'}}
            >{this.props.content}</span>
        )
    }

}

export default word;