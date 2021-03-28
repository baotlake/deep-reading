import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { rootReducer } from '@wrp/reading-core'
import thunk from 'redux-thunk'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './containers/App'
import Analytics from './containers/Analytics'

import * as serviceWorker from './serviceWorker'

const traget = document.getElementById('wrp-root')
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

render(
    <Provider store={store}>
        <Router>
            <App />
            <Analytics />
        </Router>
    </Provider>,
    traget
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

export { store }
