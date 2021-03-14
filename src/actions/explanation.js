import axios from 'axios'
import { get } from 'lodash'

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
        let url = `https://1773134661611650.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/wrp/wrp_server/iciba?w=${
            word.toLowerCase()
        }`
        let timeout = 10000;
        
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

