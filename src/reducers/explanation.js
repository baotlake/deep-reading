const explanation = (state = {}, action) => {
    switch (action.type) {
        case "SHOW_EXPANATION":
            console.log(`reducers count: ${state.count}`)
            let count = state.count  + 1 || 1
            return { ...state, word:'WORD', count: count }
        case "expl/TAPWORD":
            if( action.coordinate == null) return {...state, word: action.word }
            return {...state, word: action.word, coordinate: action.coordinate}
        case "expl/SETSHOW":
            console.log('reducer set show')
            return {...state, show: action.show}
        case "expl/SETDATA":
            return {...state, data: action.data}
        case "expl/SETEXPLSTATE":
            return {...state, status: action.status}
        case "expl/SETPLAYAUDIO":
            return {...state, audio: action.audio}
        case "expl/SETZOOM":
            let zoom = ((state.zoom == null) ? 0 : state.zoom) + action.zoom;
            if(typeof(zoom)!=='number' || Number.isNaN(zoom)) zoom = 0;
            return {...state, zoom: zoom}
        case "expl/ADDMORE":
            let more = Array.isArray(state.more) ? state.more.concat(action.more) : [action.more]
            more = more.filter(word => typeof(word) === 'string')
            return {...state, more: more}
        case "exp/SETMORE":
            return {...state, more: action.more}
        case "expl/SETSETTING":
            let setting = {...state.setting, ...action.setting}
            return {...state, setting: setting}
        case "expl/SETMOREFOLD":
            if( action.isUnfold == null){
                return {...state, unfoldMore: ! state.unfoldMore}
            }
            return {...state, unfoldMore: action.unfoldMore}
        default:
            return state
    }
}

export default explanation