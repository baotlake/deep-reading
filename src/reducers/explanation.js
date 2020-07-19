const explanation = (state = {}, action) => {
    switch (action.type) {
        case "SHOW_EXPANATION":
            console.log(`reducers count: ${state.count}`)
            let count = state.count  + 1 || 1
            return { ...state, word:'WORD', count: count }
        default:
            return state
    }
}

export default explanation