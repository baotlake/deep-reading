import React, { forwardRef, useEffect, useState, useRef } from "react";
import classNames from "classnames";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// import styled from "@emotion/styled";
import { styled } from '@mui/system'

type Rect = {
  width: number
  left: number
  bottom: number
}

interface Props {
  visible: boolean
  data: any
  positionRect?: Rect
  onClose?: () => void
}

const Box = styled('div')`
  position: fixed;
  opacity: 0;
  pointer-events: none;

  padding: ${20 / 16 + 'em'} ${30 / 16 + 'em'} ${20 / 16 + 'em'} ${20 / 16 + 'em'};
  width: ${500 / 16 + 'em'};
  max-width: min(90%, 90vw);
  height: auto;
  border-radius: ${6 / 16 + 'em'};
  border: 1px solid rgba(0,0,0,0.2);
  top: 300px;
  background: white;
  box-shadow: 0 0 ${10 / 16 + 'em'} rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  box-sizing: border-box;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Button = styled('div')`
  display: block;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: ${5 / 16 + 'em'};
  width: ${20 / 16 + 'em'};
  height: ${20 / 16 + 'em'};
  text-align: center;
  cursor: pointer;
  box-sizing: content-box;
  color: #5a5a5a;
`;

function TranslateBox(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>
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
      <Box
        ref={innerRef}
        className={classNames({ visible: props.visible })}
        data-wrp-action="no-tapBlank no-translate no-lookup"
      >
        <Button className={"close-button"} onClick={props.onClose}>
          <CloseRoundedIcon fontSize={"small"} sx={{ fontSize: 20 / 16 + 'em' }} />
        </Button>
        <div data-wrp-action="lookup">{props.data?.original}</div>
        <br />
        <div>{props.data?.translated}</div>
      </Box>
    </>
  );
}

export default forwardRef<HTMLDivElement, Props>(TranslateBox)
