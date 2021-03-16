import axios from 'axios'
import { get } from 'lodash'

import { extractPart } from '../utils/core'
import { lookupUrl } from "../utils/config";

export const setWord = (word, coordinate) => ({
    type: "expl/SETWORD",
    word: word,
    coordinate: coordinate
})

export const setShow = show => ({
    type: "expl/SETSHOW",
    show
})

export const setData = data => ({
    type: "expl/SETDATA",
    data
})

/** 
 * 请求接口获取单词释义
 *  并 setData, addMore, setExplState
 */
export const loadWordData = word => {
    return async dispatch => {
        const url = lookupUrl(word);
        // let timeout = 10000;

        const response = await fetch(url);
        if (response.status > 299) {
            dispatch(setExplState("failed"));
        }

        const data = (await response.json()).data || {};
        let more = (data.answer || []).join(";").match(/[a-zA-Z]{3,30}/g) || [];
        dispatch(setData(data));
        dispatch(addMore(more))
        dispatch(setExplState("completed"))
    }
}

export const setExplState = status => ({
    type: "expl/SETEXPLSTATE",
    status
})

export const setPlayAudio = audio => ({
    type: "expl/SETPLAYAUDIO",
    audio
})

export const setZoom = zoom => ({
    type: "expl/SETZOOM",
    zoom
})

export const addMore = more => {

    more = [].concat(more)
    more = more.filter(w => typeof w === 'string')
    more = more.map(w => w.toLowerCase())
    return {
        type: "expl/ADDMORE",
        more
    }

}

/** & addMore */
export const setMore = more => {
    more = more.filter(w => typeof w === 'string')
    more = more.map(w => w.toLowerCase())
    return {
        type: "exp/SETMORE",
        more
    }
}

export const setSetting = setting => ({
    type: "expl/SETSETTING",
    setting
})

export const setMoreFold = isUnfold => ({
    type: "expl/SETMOREFOLD",
    isUnfold
})

export const tapWord = (e) => {
    let target = window.getSelection().anchorNode;
    console.log("action tapWord: ", e, target);

    if (!target) return () => { }
    if (target.parentNode !== e.target) return () => { }
    if (!target.wholeText) return () => { }

    let offset = window.getSelection().anchorOffset;
    let clickedChar = target.wholeText.slice(offset, offset + 1);
    if (/\W/.test(clickedChar)) return () => { }

    let part = extractPart(target, offset, "word");
    let word = part[0].texts.join("") + part[1].texts.join("");
    if (!word) return () => { }

    console.log("tapWord word 【", word, "】", target.wholeText);

    let position = { x: e.pageX, y: e.pageY, clientY: e.clientY };

    return dispatch => {
        dispatch(setWord(word, position));
        dispatch(loadWordData(word));
        dispatch(setShow(true));

        /** 驼峰写法拆分 */
        let more = word.match(/([A-Z]?[a-z]+)|([A-Z]{3,})/g);
        if (more)
            dispatch(
                setMore(more.length > 1 || more[0] !== word ? more : [])
            );
    }
}