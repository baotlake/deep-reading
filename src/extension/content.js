
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

import {
    BrowserRouter as Router,
} from 'react-router-dom'



import App from '../App'
import '../common.scss'

const div = document.createElement('div')
div.style = `
    z-index: 99999999999999999999
`

const target = document.body.appendChild(div)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
)

render(
    <Provider store={store}>
        <Router>
            <App></App>
        </Router>
    </Provider>,
    target
)