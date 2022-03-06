import { render } from 'react-dom'
import { Popup } from '../../components/Popup'
import { ExtMessageData } from '../../types'
import { sendMessage } from '../../uitls/extension'


const target = document.querySelector('#root')
render(<Popup />, target)

sendMessage<ExtMessageData>({ type: 'popupActive' })

