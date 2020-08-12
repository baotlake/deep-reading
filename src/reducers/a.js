const a = (state={}, action) => {
    switch(action.type) {
        case "a/SETSHOW":
            console.log('a setshow')
            if( !action.status ) return { ...state, show:!state.status }
            return { ...state, show: action.status }
        case "a/SETSRC":
            return { ...state, url:action.url }
        default:
            return { ...state }
    }
}

export default a;