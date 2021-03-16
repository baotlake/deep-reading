console.log('background.js')

chrome.runtime.onInstalled.addListener((details)=>{
    if(details.reason === 'install'){
        // do some thing
    }
})

chrome.runtime.onMessage.addListener((message,sender, response)=>{
    console.log('background onMessage', message)

})

export {}