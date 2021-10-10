import { registerSendMessage } from '@wrp/core/dist/injection/extension'
import Root from './Root'
import { sendEventMessage } from './message'
import {render} from "react-dom"
import jss, {create} from "jss"
import {jssPreset} from "@material-ui/core/styles"

registerSendMessage(sendEventMessage)

function createApp() {
    let root = document.querySelector('#deep-reading-root')
    if (root === null) {
        root = document.createElement('div')
        root.id = 'deep-reading-root'
        document.body.appendChild(root)
    }
    root.setAttribute("wrp-action", "no-look-up")

    const shadowRoot = root.attachShadow({mode: 'open'})
    const reactRoot = document.createElement('div')
    reactRoot.id = 'react-root'
    const otherRoot = document.createElement('div')
    otherRoot.id = 'other-root'

    shadowRoot.appendChild(otherRoot)
    shadowRoot.appendChild(reactRoot)
    // root.appendChild(otherRoot)
    // root.appendChild(reactRoot)

    const _jss = create({
        ...jssPreset(),
        insertionPoint: otherRoot
    })

    jss.setup({insertionPoint: otherRoot})
    render(<Root jss={_jss} root={reactRoot}/>, reactRoot)
}

createApp()

console.log('content.js')

