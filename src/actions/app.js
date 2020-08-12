import axios from 'axios'

export const setStatus = (status) => ({
    type: "app/SETSTATUS",
    status
})

export const setXmlDoc = (xmlDoc) => ({
    type: "app/SETXMLDOC",
    xmlDoc
})

export const setUrl = (url) => ({
    type:"app/SETURI",
    url
})

export const setKey = (key) => ({
    type: "app/SETKEY",
    key
})

export const setLocation = (location) => {
    if (location === undefined) {
        return ({
            type: "app/SETLOCATION",
            location: {}
        })
    }
    if (typeof(location) === 'string') {
        return ({
            type: "app/SETLOCATION",
            location: {
                path: location
            }
        })
    }

    if(typeof(location) === 'object') {
        return ({
            type: "app/SETLOCATION",
            location
        })
    }
}

export const setHistory = (historyList, item) => {
    // 去重
    console.log('action setHistory: item', item, 'list: ', historyList)

    if( ! Array.isArray(historyList)) historyList = [];

    if(item){
        let i = historyList.length
        historyList = historyList.filter(v => v.url !== item.url || v.key !== item.key)

        console.log('actions app : history.push: ', item)
        historyList.push(item);
    }

    while(historyList.length > 200){
        // Array.shift() 移除数组中的第一个值并返回
        let remove = historyList.shift();
        if(remove.key) localStorage.removeItem(remove.key);
    }

    console.log('actions setHistory 3', historyList);

    // 存储
    let historyStr = JSON.stringify(historyList);
    localStorage.setItem('read_history', historyStr);

    return ({
        type: "app/SETHISTORY",
        history: historyList
    })
}

export const loadXmlDoc = (input) => {
    console.log('action creaters loadXMLDoc')
    return dispatch => {

        let encode = encodeURIComponent(input);
        let url2 = `https://1773134661611650.ap-northeast-1.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
        let url = `https://1773134661611650.ap-northeast-1.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;

        // let url = `http://47.94.145.177:8000/get?url=${encode}`;
        let inputObj = new URL(input);
        let timeout = 60000;
        switch(inputObj.host){
            case "www.wikipedia.org":
            case "wikibooks.org":
            case "m.wikipedia.org":
            case "en.wikipedia.org":
            case "en.m.wikipedia.org":
            case "twitter.com":
            case "t.co":
            case "news.google.com":
            case "developer.chrome.com":
            case "www.bbc.com":
            case "bbc.com":
            case "blog.diigo.com":
            case "diigo.com":
            case "www.kali.org":
                url = url2;
                timeout = 80000;
                break;
            case "localhost:3000":
            case "localhost:8888":
                url = input;
                break;
        }

        return new Promise(async (resolve,reject) => {
            try{
                let res = await axios({url:url, method:"get", timeout: timeout})
                if (res.status === 200){
                    dispatch(setXmlDoc(res.data))
                    dispatch(setStatus('parsing'))
                }else{
                    console.log(`loadxmldoc status!=200, res:${res}`)
                    dispatch(setStatus('failed'))
                }
            }catch(e){
                console.log(`loadxmldoc catch err : ${e}`)
                dispatch(setStatus('failed'))
            }
            
            
        })
    }

}

export const goRead = (input, currentUrl) => {
    // input 可以是输入框输入, 历史banner中的url, 阅读页面中的url
    return dispatch => {

        let urlPattern = /^https?:\/\/(.+\.\w+.*)|(localhost.*)/
        let isUrl = input.length < 10000 ? urlPattern.test(input) : false
    
        if (isUrl && input === currentUrl) {
            // 将要打开的页面与当前阅读的页面是同一个
            dispatch(setStatus('parsing'))
            dispatch(setLocation('/wrp-read'))
            return;
        }
        if( ! isUrl ) {
            // input 不是url， 是文本
            dispatch(setXmlDoc( input ))
            dispatch(setUrl(''))
            dispatch(setStatus('parsing'))
            dispatch(setLocation('/wrp-read'))

            return;
        }
    
        // 将要打开的是新页面
        dispatch(setStatus('loading'))
        dispatch(loadXmlDoc(input))
        dispatch(setLocation('/wrp-read'))

    }

}