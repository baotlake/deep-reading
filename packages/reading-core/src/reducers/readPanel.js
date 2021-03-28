
export default function readPanel (state = {}, action) {
    switch (action.type) {
        case 'readPanel/SETTOOLBAR':
            return { ...state, toolbar: action.toolbar }
        default:
            return state
    }
}
