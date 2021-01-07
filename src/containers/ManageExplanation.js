import { connect } from 'react-redux'

import * as explActions from '../actions/explanation'
import Explanation from '../components/explanation'

const mapStateToProps = state => ({
    explanation: state.explanation
})

const mapDispatchToProps = dispatch => ({
    setSetting: setting => {
        dispatch(explActions.setSetting(setting))
    },
    setMoreFold: isUnfold => {
        dispatch(explActions.setMoreFold(isUnfold))
    },
    loadWordData: (word) =>{
        dispatch(explActions.loadWordData(word))
    },
    setZoom: zoom => {
        dispatch(explActions.setZoom(zoom))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Explanation)
