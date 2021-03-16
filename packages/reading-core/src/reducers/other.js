const other = (state = {}, action) => {
    switch (action.type) {
        case "SHOW_EXPANATION_sdfsdf":
            let count = state.count  + 1 || 1
            return { ...state, word:'WORD', count: count }
        default:
            return state
    }
}

export default other