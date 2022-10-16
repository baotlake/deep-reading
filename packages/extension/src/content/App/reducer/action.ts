
export function setPopupVisible(value: boolean) {
    return {
        type: 'popupVisible' as 'popupVisible',
        payload: {
            visible: value,
        }
    }
}

export function showContentPopup(tab: chrome.tabs.Tab) {

    return {
        type: 'showContentPopup' as 'showContentPopup',
        payload: {
            popup: {
                visible: true,
            },
            tab,
        }
    }
}

type ActionFunction =
    | typeof setPopupVisible
    | typeof showContentPopup

export type Action = ReturnType<ActionFunction>