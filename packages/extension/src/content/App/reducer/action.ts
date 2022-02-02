
export function setPopupVisible(value: boolean) {
    return {
        type: 'popupVisible',
        payload: {
            visible: value,
        }
    }
}

export type Action = ReturnType<typeof setPopupVisible>