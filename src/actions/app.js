export const setStatus = (status) => ({
    type: "app/SETSTATUS",
    status
})



export const showExpanation = (word) => ({
    type: "SHOW_EXPANATION",
    word: word
})

export const setXmlDoc = (xmlDoc) => ({
    type: "app/SETXMLDOC",
    xmlDoc
})


export const loadXmlDoc = (input) => {
    let encode = encodeURIComponent(input);
    let url2 = `https://1773134661611650.ap-northeast-1.fc.aliyuncs.com/2016-08-15/proxy/Tr/tr/?url=${encode}`;
    let url = `https://baotlake.ink:8001/get?url=${encode}`;
    let inputObj = new URL(input);
    let timeout = 10000;
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
            timeout = 50000;
            break;
        case "localhost:3000":
        case "localhost:8888":
            url = input;
            break;
    }
    
    fetch(url).then(res => {
        const parser = new DOMParser()
        dispatch(setXmlDoc())
    })

}