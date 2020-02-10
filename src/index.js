import React from 'react';
import ReactDOM from 'react-dom';

import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';

import './index.css';
import App from './App';
import WebApp from './webApp';
import * as serviceWorker from './serviceWorker';

// //  'test/google-wiki.html'       'example.html'     'test/weinan-wiki.html' switch_mdn-Google.html
// let text = getText('example.html');
// var parser = new DOMParser();
// var xmlDoc = parser.parseFromString(text,"text/html");
// // let node = xmlDoc;

// var xmlDoc_d = parser.parseFromString('<body/>',"text/html");



// // node = Object.assign(xmlDoc_d, node); 
// // node = document.body;

// // console.log('index-1 node', node);

// // console.log('document.body', node)

// // let container = document.createElement('div');
// // let renderTarget = document.body.insertBefore(container, document.body.firstChild);

// // renderTarget = document.body;

let renderTarget = document.getElementById('root');

// ReactDOM.render(<App doc={node}/>, document.getElementById('root'));

ReactDOM.render(<WebApp/>, renderTarget);
// ReactDOM.render(<App doc={xmlDoc}/>, renderTarget);

// ReactDOM.render(<App doc={node}/>, document.body);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();