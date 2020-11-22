import axios from 'axios';
import { get } from 'lodash';

import { extractPart, extractHead } from '../utils/core'

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
    return dispatch => {
        // let url = `https://1773134661611650.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/WordingReadingPro/iciba/?key=zysj&q=${word.toLowerCase()}`
        let url = `https://1773134661611650.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/wrp/wrp_server/iciba?w=${word.toLowerCase()}`;
        let timeout = 10000;
        let iciba2Data = (apiData) => {
            let data = {};
            let more = [];
            if (!apiData.word_name) return data;
            data.word = apiData.word_name;
            if (Object.keys(apiData).includes('word_name')) {
                data.audio = apiData.symbols[0].ph_tts_mp3;
                data.audioUK = apiData.symbols[0].ph_en_mp3;
                data.audioUS = apiData.symbols[0].ph_am_mp3;
                data.answer = apiData.symbols[0].parts.map(o => [o.part, o.means.join(' ')]);
                // 提取单词解释里的单词
                more = apiData.symbols[0].parts.map(i => i.means.join(' ')).join(' ').match(/[a-zA-Z]{3,20}/);
            }
            return { data, more };
        }
        return new Promise(async (resolve) => {
            try {
                let res = await axios({ url: url, method: "get", timeout: timeout });
                if (res.status === 200) {
                    console.log('res', res, '\n', res.data)
                    let data = get(res, 'data.data') || {}
                    let more = (data.answer || []).join(';').match(/[a-zA-Z]{3,30}/g) || []
                    console.log('loadWordData', data, more)
                    dispatch(setData(data))
                    dispatch(addMore(more))
                    dispatch(setExplState('completed'))
                    console.log('--end--')
                } else {
                    console.log()
                    throw new Error('request status != 200')
                }
            } catch (e) {
                console.log('loadWordData Error', e);
                dispatch(setExplState('failed'))
            }
            resolve()
        })
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


export const tapWord = (event) => {

    let target = window.getSelection().anchorNode;
    console.log('action tapWord: ', event, target);

    if (!target) return setShow(false);
    if (target.parentNode !== event.target) return setShow(false);
    if (!target.wholeText) return setShow(false);

    let offset = window.getSelection().anchorOffset;
    let clickedChar = target.wholeText.slice(offset, offset + 1);
    if (/\W/.test(clickedChar)) return setShow(false);

    let part = extractPart(target, offset, 'word');
    let word = part[0].texts.join('') + part[1].texts.join('');
    if (!word) return setShow(false);

    // console.log('tapWord action', word, target.wholeText)

    let position = { x: event.pageX, y: event.pageY, clientY: event.clientY };

    return dispatch => {
        dispatch(setWord(word, position))
        dispatch(loadWordData(word))
        dispatch(setShow(true))
        /** 驼峰写法拆分 */
        let more = word.match(/([A-Z]?[a-z]+)|([A-Z]{3,})/g)
        if (more)
            dispatch(setMore(more.length > 1 || more[0] !== word ? more : []))
    }
}


