import React, { forwardRef, useEffect, useRef, useImperativeHandle, CSSProperties } from "react";
import classNames from "classnames";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { config } from './boxConfig'
import { useEscapeHide } from "../../hooks";
import usePosition from "./usePosition";
import { Wrapper, Button, BorderBox, Content } from './Box.style'

interface Props {
  visible: boolean
  data: any
  position?: DOMRect
  onClose?: () => void
}

function TranslateBox(
  { visible, data, position, onClose }: Props,
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

  const place = usePosition(innerRef, position)

  useEscapeHide(visible, onClose)

  return (
    <>
      <Wrapper
        ref={innerRef}
        className={classNames({ hidden: !visible })}
        data-wrp-action="no-tapBlank no-translate no-lookup"
      >
        <BorderBox
          className={classNames(place.direction)}
          style={{
            '--left': Math.round(place.rx * 100) + '%',
          } as CSSProperties}
        >
        </BorderBox>
        <Button className={"close-button"} onClick={onClose}>
          <CloseRoundedIcon
            fontSize={"small"}
            sx={{ fontSize: 20 / 16 + 'em', display: 'block' }}
          />
        </Button>

        <Content data-wrp-action="lookup">
          <blockquote>{data?.original}</blockquote>
          <p>
            {
              !data?.translated &&
              <span style={{ visibility: 'hidden' }}>
                {data?.original}
              </span>
            }
            {data?.translated}
          </p>
        </Content>
      </Wrapper>
    </>
  );
}

export default forwardRef<HTMLDivElement, Props>(TranslateBox)
