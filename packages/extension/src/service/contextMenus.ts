import { createContextMenus, updateContextMenus } from '../uitls/extension'
import { toggleCoverVisible, checkContent } from './content'

const COVER_MENU_ID = 'cover'

export function createMenu() {
    createContextMenus({
        contexts: ['all'],
        id: COVER_MENU_ID,
        title: '专注蒙层',
        enabled: true,
        visible: true,
        documentUrlPatterns: ['https://*/*'],
    })
    console.log('create menus')
}

export function handleMenuClick(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
    console.log('click menus: ', info, tab)
    const id = info.menuItemId
    switch (id) {
        case 'cover':
            checkContent().then(() => {
                toggleCoverVisible(tab.id)
            })
            break
    }
}
