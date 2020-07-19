const app = (state = {}, action) => {
    switch (action.type) {
        case "app/SETSTATUS":
            return {...state, status: action.status}
        default:
            return state
    }
}

export default app