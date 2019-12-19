import React from 'react';

class word extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <span 
                id={'a'} 
                onClick={()=>{alert('click')}}
                style={{'backgroundColor':'#fff','borderRadius':'5px'}}
            >{this.props.content}</span>
        )
    }

}

export default word;