

export default function (state = {}, action) {
    switch (action.type) {
        case "readPanel/SETMENUSTYLE":
            return { ...state, menuStyle: action.style }
            break;
        case "readanel/SETTARGET":
            return { ...state, target: action.target }
        default:
            return state;
    }
}