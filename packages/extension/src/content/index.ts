import '@wrp/core/dist/injection/extension'

import './root.tsx'


import {sendMessage} from '../uitls/extension'

console.log('content.js')

const port = chrome.runtime.connect({name: "aaaaa-bbb", includeTlsChannelId: true})
console.log('content connect port', port)


window.addEventListener('message', (e) => {
    console.log('content onMessage: ', e)

    console.log('content sendMessage to background -->')
    sendMessage(e.data)
})

setTimeout(() => {
    window.postMessage({
        'a-a': 'b-b'
    }, '*')
}, 1000)

