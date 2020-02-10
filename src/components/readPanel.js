import React from "react";
import './readPanel.css';

import Switch from './switch.js';

class ReadPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){

        let style = {}
        if(this.props.padding) style.padding = '1em';


        return (
            <div 
                className="read-panel" 
                style={style}
                onClick={this.props.handleClick}
            >
                {this.props.content}
            </div>
        )
    }
}

export default ReadPanel;