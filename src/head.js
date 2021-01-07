import React, { useState } from "react";
import { connect } from "react-redux";

import logo from "./components/res/logo.png";
import manifest from "./manifest.json";

import './Head.scss'

function Head(props) {
  return <div id="wrp-head">{props.heads}</div>;
}

const mapStateToProps = (state) => ({
  heads: state.webApp.heads,
});

export default connect(mapStateToProps)(Head);