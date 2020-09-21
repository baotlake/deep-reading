const translate = (state = {}, action) => {
    switch(action.type){
        case "translate/SETSHOW":
            return { ...state, show: action.value }
        case "translate/SETORIGINAL":
            return { ...state, original: action.original }
        case "translate/SETTRANSLATION":
            return { ...state, translation: action.translation}
        case "translate/SETSTATUS":
            return { ...state, status: action.status }
        // case "":
        //     return { ...state, }
        default:
            return state
    }
}

export default translate