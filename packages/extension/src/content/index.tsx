
import { MessageData, TargetType } from '@wrp/core'
import { addContentMessageListener } from '@wrp/inject'
import { ExtMessageData } from '../types/message'
import { addMessageListener, sendMessage } from '../uitls/extension'
import { hanldeExtMessage, handleContentMessage } from './message'


function main() {
    console.log('deep reading content', globalThis.CONTENT_INITED)
    if (globalThis.CONTENT_INITED === true) return
    globalThis.CONTENT_INITED = true
    addMessageListener(hanldeExtMessage)
    addContentMessageListener<MessageData>(handleContentMessage)

    sendMessage<ExtMessageData>({
        type: 'contentActive',
    })
}

main()
