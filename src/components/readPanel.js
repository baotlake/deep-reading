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
        let style = {
            
        }

        return (
            <div className="read-panel" style={style}>
                <Switch></Switch>
                <div>Read Panel</div>
                {this.props.content}
            </div>
        )
    }
}

export default ReadPanel;