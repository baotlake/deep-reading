import {
    handleMessage,
    handleInstalled,
    handleStartup,
    handleMenuClick,
    handleActionClick,
} from '../../service'

import {
    addMessageListener,
    addInstalledListener,
    addStartupListener,
    addContextMenusListener,
    addClickedActionListener,
} from '../../uitls/extension'

addMessageListener(handleMessage)
addInstalledListener(handleInstalled)
addStartupListener(handleStartup)
addContextMenusListener(handleMenuClick)
addClickedActionListener(handleActionClick)

console.log('background.js')
