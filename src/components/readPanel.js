import React from "react";
import './readPanel.css';

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
                <div>Read Panel</div>
                {this.props.content}
            </div>
        )
    }
}

export default ReadPanel;