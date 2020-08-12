import { combineReducers } from 'redux'

import app from './app'
import explanation  from './explanation'
import a from './a'
import other  from './other'

console.log(`reducers.js explanation:${explanation}`)

export default combineReducers({
    app,
    explanation,
    a,
    // other
})