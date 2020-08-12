import axios from 'axios';

export const tapWord = (word, coordinate) => ({
    type: "expl/TAPWORD",
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

export const loadWordData = word => {
    return dispatch => {
        let url = `https://1773134661611650.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/WordingReadingPro/iciba/?key=zysj&q=${word.toLowerCase()}`
        // let url = `http://47.94.145.177:8000/iciba?w=${word.toLowerCase()}`;
        let timeout = 10000;
        let iciba2Data = (apiData) => {
            let data = {};
            let more = [];
            if(!apiData.word_name) return data;
            data.word = apiData.word_name;
            if(Object.keys(apiData).includes('word_name')){
                data.audio = apiData.symbols[0].ph_tts_mp3;
                data.audioUK = apiData.symbols[0].ph_en_mp3;
                data.audioUS = apiData.symbols[0].ph_am_mp3;
                data.answer = apiData.symbols[0].parts.map(o=>[o.part, o.means.join(' ')]);
                // 提取单词解释里的单词
                more = apiData.symbols[0].parts.map(i=>i.means.join(' ')).join(' ').match(/[a-zA-Z]{3,20}/);
            }
            return { data, more };
        }
        return new Promise(async (resolve,reject) => {
            try{
                let res = await axios({url:url, method:"get",timeout: timeout});
                if (res.status === 200){
                    let { data, more } = iciba2Data(res.data);
                    dispatch(setData(data))
                    dispatch(addMore(more))
                    dispatch(setExplState('completed'))

                }else {
                    console.log()
                    dispatch()
                }
            }catch(e){
                console.log('loadWordData Error', e);
                dispatch(setExplState('failed'))
            }
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

export const addMore = more => ({
    type: "expl/ADDMORE",
    more
})

export const setMore = more => ({
    type: "exp/SETMORE",
    more
})

export const setSetting = setting => ({
    type: "expl/SETSETTING",
    setting
})

export const setMoreFold = isUnfold => ({
    type: "expl/SETMOREFOLD",
    isUnfold
})
