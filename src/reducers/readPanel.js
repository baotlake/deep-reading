

export default function (state = {}, action) {
    switch (action.type) {
        case "readPanel/SETMENUSTYLE":
            return { ...state, menuStyle: action.style }
            break;
        case "readPanel/SETTARGET":
            return { ...state, target: action.target }
        case "readPanel/SETSHOW":
            return { ...state, show: action.show }
        default:
            return state;
    }
}