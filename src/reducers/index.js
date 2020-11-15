import { combineReducers } from 'redux'

import webApp from './webApp';
import app from './app';
import explanation  from './explanation';
import a from './a';
import translate from './translate';
import readPanel from './readPanel';
import other  from './other';

console.log(`reducers.js`);

export default combineReducers({
    webApp,
    app,
    explanation,
    a,
    translate,
    readPanel,
    // other
})