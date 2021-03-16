import { connect, useDispatch } from "react-redux";

import * as explActions from "../actions/explanation";
import Explanation from "../components/Explanation";

const mapStateToProps = (state) => ({
  explanation: state.explanation,
});

const mapDispatchToProps = (dispatch) => ({
  setSetting: (setting) => {
    dispatch(explActions.setSetting(setting));
  },
  setMoreFold: (isUnfold) => {
    dispatch(explActions.setMoreFold(isUnfold));
  },
  setZoom: (zoom) => {
    dispatch(explActions.setZoom(zoom));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Explanation);
