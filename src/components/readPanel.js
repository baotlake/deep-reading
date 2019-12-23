import React from "react";

class ReadPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let style = {
            "width":"500px",
            // "height":"100vh",
            "backgroundColor":"#eee",
            "borderRadius":"3px",
            "padding":"20px"
        }

        return (
            <div style={style}>
                <div>Read Panel</div>
                {this.props.content}
            </div>
        )
    }
}

export default ReadPanel;