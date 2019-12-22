import React from 'react';
import ReactDOM from 'react-dom';

import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import getText from './text.js';
// import Word from './components/word.js';
// import ExplainPanel from './components/expainPanel.js';


ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
