import React from 'react';
import ReactDOM from 'react-dom';

import logo from './components/res/logo.png';
import manifest from './manifest.json';


function head(child){
    let head = [];
    head = head.concat(child);
    ReactDOM.render(head, document.getElementById('wrp-head'));
}

export default head;