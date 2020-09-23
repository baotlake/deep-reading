import axios from 'axios';
import { get } from 'lodash'

import { extractPart } from '../utils/core'

export const setShow = value => ({
    type: "translate/SETSHOW",
    value
})

export const setOriginal = original => ({
    type: "translate/SETORIGINAL",
    original
})

export const setStatus = status => ({
    type: "translate/SETSTATUS",
    status
})

export const setTranslation = translation => ({
    type: "translate/SETTRANSLATION",
    translation
})

export const slipTranslate = event => {
    let url = "https://1773134661611650.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/wrp/wrp_server/alimt"
    let target = event.target;
    // let offset = get(event, 'target.innerText.length', 2) / 2
    let part = extractPart(target, null,'sentence');
    let sentence = part[0].texts.join('') + part[1].texts.join('');
    sentence = sentence.trim();

    if(sentence.length < 3) return ;

    let original = {
        text:sentence,
        elements:[...part[0].elements,...part[1].elements]
    }

    return dispatch => {
        dispatch(setShow('half'))
        dispatch(setStatus('loading'))
        dispatch(setOriginal(original))
        let formData = new URLSearchParams()
        formData.append('text', sentence)
        return new Promise(async resolve => {
            try{
                let res = await axios({
                    url: url,
                    method: "POST",
                    data: formData
                })
                if(res.status === 200){
                    console.log('slipTranslate', res)
                    dispatch(setTranslation({
                        text: res.data.Data.Translated,
                        elements: res.data.Data.Translated
                    }))
                    dispatch(setStatus('completed'))
                }else{
                    throw new Error('request status != 200')
                }
            }catch(e){
                console.log('slip translate error', e)
    
            }
            resolve()
        })     
    }
}