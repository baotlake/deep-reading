import React from "react";
import { connect } from "react-redux";
import "./readPanel.scss";
import * as actions from '../actions/readPanel';


function ReadPanel(props) {
    const style = {};

    return (
        <div
            id="wrp-read-panel"
            style={style}
        >
            { props.webApp.elements}
        </div>
    )
}

const mapStateToProps = (state) => ({
    webApp: state.webApp,
    menuStyle: state.readPanel.menuStyle,
    target: state.readPanel.target,
});

const mapDispatchToProps = (dispatch) => ({
    setMenuStyle: (style) => {
        dispatch(actions.setMenuStyle(style))
    },
    hiddenMenu: () => {
        dispatch(actions.hiddenMenu())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReadPanel);