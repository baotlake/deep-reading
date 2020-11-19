const webApp = (state = {}, action) => {
    switch (action.type) {
        case "webApp/SETSTATUS":
            return {...state, status: action.status}
        case "webApp/SETXMLDOC":
            // console.log(`reducers app/SETXMLDOC: xmlDoc: ${action.xmlDoc}`)
            return {...state, xmlDoc: action.xmlDoc}
        case "webApp/SETURI":
            return {...state, url: action.url}
        case "webApp/SETHISTORY":
            return {...state, history: action.history}
        case "webApp/SETLOCATION":
            return {...state, location: action.location}
        case "webApp/SETKEY":
            return {...state, key: action.key}
        case "webApp/SETELEMENTS":
            return {...state, elements: action.elements}
        case "webApp/SETHEADS":
            return {...state, heads: action.heads}
        default:
            return state
    }
}

export default webApp