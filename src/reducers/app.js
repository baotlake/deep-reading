const app = (state = {}, action) => {
    switch (action.type) {
        case "app/":
            return {...state, status: action.status}
        case "app/":
            // console.log(`reducers app/SETXMLDOC: xmlDoc: ${action.xmlDoc}`)
            return {...state, xmlDoc: action.xmlDoc}
        case "app/":
            return {...state, url: action.url}
        default:
            return state
    }
}

export default app