import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers'; 
import thunk from 'redux-thunk';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useRouteMatch,
    useParams,
    useHistory,
    withRouter,

} from 'react-router-dom';


// import ReactDOMServer from 'react-dom/server';
// import ReactHtmlParser from 'react-html-parser';

import './index.css';
import WebApp from './webApp';
import * as serviceWorker from './serviceWorker';

const traget = document.getElementById('wrp-root')
const store = createStore( rootReducer, applyMiddleware(thunk))

render(
    <Provider store={store}>
        <Router>
            <WebApp/>
        </Router>
    </Provider>
    , traget);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { store }