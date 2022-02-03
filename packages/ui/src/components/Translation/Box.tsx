import React, { forwardRef, useEffect, useState, useRef } from "react";
import classNames from "classnames";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import styled from "@emotion/styled";

interface Props {
  visible: boolean;
  data: any;
  positionRect?: DOMRect;
  onClose?: () => void;
}

const Box = styled.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;

  padding: 20px 30px 20px 20px;
  width: 500px;
  height: auto;
  border-radius: 2px;
  top: 300px;
  background: white;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  font-size: 14px;
  line-height: 1.5;
  box-sizing: border-box;
  max-width: min(100%, 100vw);

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Button = styled.div`
  display: block;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px;
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  box-sizing: content-box;
  color: #5a5a5a;
`;

export default forwardRef<HTMLDivElement, Props>(function TranslateBox(
  props,
  ref
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else if (ref) {
      ref.current = innerRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (innerRef.current) {
      const rect = innerRef.current.getBoundingClientRect();
      dataRef.current.width = rect.width;
      dataRef.current.height = rect.height;

      const rangeRect = props.positionRect;

      if (rangeRect) {
        let left = rangeRect.width / 2 + rangeRect.left - rect.width / 2;
        if (left < 20) left = 20;
        const maxLeft = window.innerWidth - rect.width - 20;
        if (left > maxLeft) left = maxLeft;

        let top = rangeRect.bottom + 20;
        const maxTop = window.innerHeight - rect.height - 20;
        if (top > maxTop) top = maxTop;

        innerRef.current.style.left = Math.round(left) + "px";
        innerRef.current.style.top = Math.round(top) + "px";
      }
    }
  }, [props.positionRect]);

  return (
    <>
      <Box ref={innerRef} className={classNames({ visible: props.visible })}>
        <Button className={"close-button"} onClick={props.onClose}>
          <CloseRoundedIcon fontSize={"small"} />
        </Button>
        <div>{props.data?.original}</div>
        <br />
        <div>{props.data?.translated}</div>
      </Box>
    </>
  );
});
