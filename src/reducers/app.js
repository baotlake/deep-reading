const app = (state = {}, action) => {
    switch (action.type) {
        case "app/SETSTATUS":
            return {...state, status: action.status}
        case "app/SETXMLDOC":
            // console.log(`reducers app/SETXMLDOC: xmlDoc: ${action.xmlDoc}`)
            return {...state, xmlDoc: action.xmlDoc}
        case "app/SETURI":
            return {...state, url: action.url}
        case "app/SETHISTORY":
            console.log(`reducers app/SETHISTORY: ${action.history}`)
            return {...state, history: action.history}
        case "app/SETLOCATION":
            return {...state, location: action.location}
        case "app/SETKEY":
            return {...state, key: action.key}
        case "app/SETELEMENTS":
            console.log('reducers set elements', action)
            return {...state, elements: action.elements}
        case "app/SETHEADS":
            return {...state, heads: action.heads}
        default:
            return state
    }
}

export default app