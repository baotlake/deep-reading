import React, { forwardRef, useEffect, useRef, useImperativeHandle, CSSProperties } from "react";
import classNames from "classnames";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { config } from './boxConfig'
import { useEscapeHidden } from "src/hooks";
import { Wrapper, Button, BorderBox } from './Box.style'

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

function TranslateBox(
  { visible, data, positionRect, onClose }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef({
    width: 0,
    height: 0,
  });

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => {
    console.log('useImperativeHandle t2:', ref, innerRef)
    const div = innerRef.current
    div && Object.assign(div, {
      transform: (x: number, y: number) => {
        div.style.transform = `translate(${x}px,${y}px)`
      }
    })
    return div
  }, [ref])

  useEffect(() => {
    if (innerRef.current) {
      const rect = innerRef.current.getBoundingClientRect();
      dataRef.current.width = rect.width;
      dataRef.current.height = rect.height;

      const rangeRect = positionRect;

      if (rangeRect) {
        const [sx, sy] = [window.scrollX, window.scrollY]
        let left = rangeRect.width / 2 + rangeRect.left - rect.width / 2;
        if (left < 20) left = 20;
        const maxLeft = window.innerWidth - rect.width - 20;
        if (left > maxLeft) left = maxLeft;

        let top = rangeRect.bottom + 20;
        const maxTop = window.innerHeight + sy - rect.height - 20;
        if (top > maxTop) top = maxTop;

        innerRef.current.style.left = Math.round(left) + "px";
        innerRef.current.style.top = Math.round(top) + "px";
      }
    }
  }, [positionRect]);

  useEscapeHidden(visible, onClose)

  return (
    <>
      <Wrapper
        ref={innerRef}
        className={classNames({ hidden: !visible })}
        data-wrp-action="no-tapBlank no-translate no-lookup"
      >
        <BorderBox
          className={classNames({
            up: true,
            down: false,
          })}
          style={{
            '--left': '50%',
          } as CSSProperties}
        >
        </BorderBox>
        <Button className={"close-button"} onClick={onClose}>
          <CloseRoundedIcon
            fontSize={"small"}
            sx={{ fontSize: 20 / 16 + 'em', display: 'block' }}
          />
        </Button>
        <div data-wrp-action="lookup">{data?.original}</div>
        <br />
        <div>{data?.translated}</div>
      </Wrapper>
    </>
  );
}

export default forwardRef<HTMLDivElement, Props>(TranslateBox)
