import React, { useState, useEffect, useMemo, useRef } from "react";
import { connect } from "react-redux";

import * as explActions from "../actions/explanation";
import * as translateActions from "../actions/translate";

import TranslatePanel from "../components/TranslatePanel";

import Touch, { TouchOrMouse } from "../utils/touch";

import "../components/translatePanel.scss";

function ManageTranslatePanel(props) {
  const handleEl = useRef(null);

  const slipTouch = useMemo(() => {
    const showStatusMap = {
      hidden: 0,
      half: 1,
      full: 2,
      0: "hidden",
      1: "half",
      2: "full",
    };
    let sumY = 0;
    let diffThreshold = 24;
    const slipMoving = (touch, e) => {
      // e.preventDefault();
      e.stopPropagation();

      let showStatus = showStatusMap[touch.data];
      let diff = Math.round(touch.sumY - sumY);

      if (showStatus === 2 && diff < 0) {
        // 无效滑动
        // handleEl.current.style.background = `linear-gradient(to right, var(--t-fore-c2) ${Math.abs(diff) - 1}%, var(--t-back-c2) ${Math.abs(diff)}%)`
      } else {
        handleEl.current.style.transform = `translateY(${diff / 2}px)`;
        handleEl.current.style.background = `linear-gradient(to right, var(--sc) ${
          Math.abs((diff / diffThreshold) * 100) - 1
        }%, var(--t-back-c2) ${Math.abs((diff / diffThreshold) * 100)}%)`;
      }

      if (Math.abs(diff) < diffThreshold) {
        return;
      }

      if (diff > diffThreshold) {
        sumY = touch.sumY;
        showStatus -= 1;
        console.log("-", showStatus);
      }

      if (diff < -diffThreshold) {
        sumY = touch.sumY;
        showStatus += 1;
        console.log("+", showStatus);
      }

      if (showStatus < 0) showStatus = 0;
      if (showStatus > 2) showStatus = 2;

      if (showStatus !== showStatusMap[touch.data]) {
        // 更新showStatus
        props.setShow(showStatusMap[showStatus]);
        touch.data = showStatusMap[showStatus];
      }
    };

    const slipStart = () => {};

    const slipEnd = () => {
      if (handleEl.current) {
        // transition: all 0.3s;
        handleEl.current.style.transform = `translateY(0px)`;
        handleEl.current.style.background = `linear-gradient(to right, var(--sc) 0%, var(--t-back-c2) 0%)`;
        handleEl.current.style.transition = `all 0.3s`;
        setTimeout(() => {
          handleEl.current.style.transition = `all 0s`;
        }, 300);
      }
      sumY = 0;
    };
    // return new Touch({ onMoving: slipMoving, onEnd: slipEnd, onStart: slipStart })
    return new TouchOrMouse({
      onMoving: slipMoving,
      onEnd: slipEnd,
      onStart: slipStart,
      button: [0, 2],
    });
  }, []);

  return (
    <TranslatePanel
      onSlipStart={slipTouch.start}
      onSlipMove={slipTouch.move}
      onSlipEnd={slipTouch.end}
      handleEl={handleEl}
      show={props.translate.show}
      original={props.translate.original || {}}
      status={props.translate.status}
      translation={props.translate.translation}
    ></TranslatePanel>
  );
}

const mapStateToProps = (state) => ({
  translate: state.translate,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  tapWord: (events) => {
    dispatch(explActions.tapWord(events));
  },
  setShow: (value) => {
    dispatch(translateActions.setShow(value));
  },
});

// export default connect(mapStateToProps, mapDispatchToProps)(TranslatePanel);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageTranslatePanel);
