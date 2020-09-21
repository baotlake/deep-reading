import { combineReducers } from 'redux'

import app from './app'
import explanation  from './explanation'
import a from './a'
import translate from './translate'
import other  from './other'

console.log(`reducers.js`)

export default combineReducers({
    app,
    explanation,
    a,
    translate
    // other
})