import { connect } from 'react-redux'

import * as explActions from '../actions/explanation'
import Explanation from '../components/Explanation'


const mapStateToProps = state => ({
    expl: state.explanation
})

const mapDispatchToProps = dispatch => ({
    setSetting: setting => {
        dispatch(explActions.setSetting(setting))
    },
    setMoreFold: isUnfold => {
        dispatch(explActions.setMoreFold(isUnfold))
    },
    tapWord: (word) => {
        dispatch(explActions.tapWord(word))
        dispatch(explActions.loadWordData(word))
        dispatch(explActions.setExplState('loading'))
    },
    setZoom: zoom => {
        dispatch(explActions.setZoom(zoom))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Explanation)
