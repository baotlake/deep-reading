import {
    handleMessage,
    handleInstalled,
    handleStartup,
    handleMenuClick,
} from '../../service'

import {
    addMessageListener,
    addInstalledListener,
    addStartupListener,
    addContextMenusListener,
} from '../../uitls/extension'

addMessageListener(handleMessage)
addInstalledListener(handleInstalled)
addStartupListener(handleStartup)
addContextMenusListener(handleMenuClick)

console.log('background.js')
