

import {
    handleMessage,
    handleInstalled,
    handleStartup,
} from '../service'
import {
    addMessageListener,
    addInstalledListener,
    addStartupListener,
} from "../uitls/extension"

addMessageListener(handleMessage)
addInstalledListener(handleInstalled)
addStartupListener(handleStartup)


