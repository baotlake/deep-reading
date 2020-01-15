import React from 'react';
import ReactDOM from 'react-dom';

import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//  'test/google-wiki.html'       'example.html'     'test/weinan-wiki.html' switch_mdn-Google.html
let text = getText('example.html');
var parser = new DOMParser();
var xmlDoc = parser.parseFromString(text,"text/html");
// let node = xmlDoc;

var xmlDoc_d = parser.parseFromString('<body/>',"text/html");


// node = Object.assign(xmlDoc_d, node); 
// node = document.body;

// console.log('index-1 node', node);

// console.log('document.body', node)

let container = document.createElement('div');
let renderTarget = document.body.insertBefore(container, document.body.firstChild);

// renderTarget = document.body;

// ReactDOM.render(<App doc={node}/>, document.getElementById('root'));
ReactDOM.render(<App doc={xmlDoc}/>, renderTarget);
// ReactDOM.render(<App doc={node}/>, document.body);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



function getText(path){ 
    let url = `http://127.0.0.1:8888/${path}`;
    url = `http://192.168.1.14:8888/${path}`;
    let request = new XMLHttpRequest(false,true);
    request.open("GET", url, false);
    request.send(null);
    if (request.status === 200) {
        // console.log(request.responseText);
        return request.responseText;
    }else{
        return 'error'
    }

}
