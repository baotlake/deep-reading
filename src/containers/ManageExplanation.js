import { connect } from 'react-redux'

import Explanation from '../components/Explanation'

const mapStateToProps = state => ({
    data: state.explanation
})

const mapDispatchToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Explanation)
