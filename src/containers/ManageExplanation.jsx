import { connect } from "react-redux";

import * as explActions from "../actions/explanation";
import Explanation from "../components/explanation";

import { lookupUrl } from "../utils/config";
import { extractPart } from "../utils/core";

export function tapWord(e) {
  let target = window.getSelection().anchorNode;
  console.log("action tapWord: ", e, target);

  if (!target) return false;
  if (target.parentNode !== e.target) return false;
  if (!target.wholeText) return false;

  let offset = window.getSelection().anchorOffset;
  let clickedChar = target.wholeText.slice(offset, offset + 1);
  if (/\W/.test(clickedChar)) return false;

  let part = extractPart(target, offset, "word");
  let word = part[0].texts.join("") + part[1].texts.join("");
  if (!word) return false;

  console.log("tapWord word", word, target.wholeText);

  let position = { x: e.pageX, y: e.pageY, clientY: e.clientY };

  explActions.setWord(word, position);
  explActions.loadWordData(word);
  explActions.setShow(true);

  /** 驼峰写法拆分 */
  let more = word.match(/([A-Z]?[a-z]+)|([A-Z]{3,})/g);
  if (more)
    explActions.setMore(more.length > 1 || more[0] !== word ? more : []);
}

async function loadWordData(word) {
  const url = lookupUrl(word);
  // const timeout = 10000;
  const response = await fetch(url);
  if (response.status > 299) {
    explActions.setExplState("failed");
  }

  const data = (await response.json()).data || {};
  let more = (data.answer || []).join(";").match(/[a-zA-Z]{3,30}/g) || [];

  explActions.setData(data);
  explActions.addMore(more);
  explActions.setExplState("completed");
}

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
  loadWordData: loadWordData,
  setZoom: (zoom) => {
    dispatch(explActions.setZoom(zoom));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Explanation);
