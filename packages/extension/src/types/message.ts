
export enum ExtMessageType {
    showPopup = 'showPopup',
}

interface ShowPopupMessage {
    type: ExtMessageType.showPopup
}

export type ExtMessageData = ShowPopupMessage