import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";
import SvgBorder from "./SvgBorder";
import Pronunciation from "./Pronunciation";
import Answer from "./Answer";
import classNames from "classnames";
import Skeleton from "@mui/material/Skeleton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Wrapper,
  BorderBox,
  Main,
  Container,
  Header,
  Content,
  CloseButton,
} from "./Explanation.style";
import usePosition from "./usePosition";
import { useEscapeHidden } from '../../hooks'
import { config } from './config'

interface PlayData {
  word: string;
  url: string;
  type: "am" | "en" | "other";
}

interface Props {
  visible: boolean;
  data: any;
  status: "loading" | "success" | "failed";
  position: [number, number];
  zoom?: number;
  onClose?: () => void;
  overridePlay?: (data: PlayData) => void;
}

function Explanation(
  { visible, data, status, position, onClose, zoom, overridePlay }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  if (!data) data = {};
  const innerRef = useRef<HTMLDivElement>(null)
  const place = usePosition(innerRef, position)

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => {
    const div = innerRef.current
    div && Object.assign(div, {
      transform: (x: number, y: number) => {
        div.style.transform = `translate(${x}px,${y}px)`
      }
    })
    return div
  }, [ref])

  useEffect(() => {
    let id: number
    if (visible && status === 'success' && !data?.answer?.length) {
      id = window.setTimeout(() => onClose && onClose(), 1000)
    }

    return () => {
      clearTimeout(id)
    }
  }, [visible, status, data])

  useEscapeHidden(visible, onClose)

  const play = useCallback(
    (type: "am" | "en" | "other") => {
      const url =
        {
          am: data.pronunciation?.audio_am,
          en: data.pronunciation?.audio_en,
          other: data.pronunciation?.audio_other,
        }[type] || "";

      overridePlay &&
        overridePlay({
          word: data.word || "",
          url: url,
          type,
        });
    },
    [data]
  );

  return (
    <Wrapper
      ref={innerRef}
      className={classNames("wrp-explanation", place.direction, {
        hidden: !visible,
      })}
      style={{
        left: place.left,
        top: place.top,
      }}
      data-wrp-action="no-tapBlank no-lookup no-translate"
    >
      <BorderBox className="border-box">
        <SvgBorder
          ratioX={place.rx}
          arrowDirection={place.direction}
          config={config}
        />
      </BorderBox>
      <Main className={"main"}>
        <Container className="container">
          <Header className="header">
            <div className="word">{data.word}</div>
          </Header>
          <Content className="content">
            <dl>
              {status === "loading" && (
                <>
                  <Skeleton
                    variant="text"
                    width={'60%'}
                    height={22}
                  />
                  <Skeleton
                    variant="text"
                    width={'40%'}
                    height={22}
                  />
                  <Skeleton
                    variant="text"
                    width={'80%'}
                    height={22}
                  />
                </>
              )}
              {status === "success" && (
                <>
                  <dt>
                    <Pronunciation
                      overridePlay={overridePlay && play}
                      data={data.pronunciation || {}}
                    />
                  </dt>
                  <Answer answer={data.answer || []} />
                </>
              )}
            </dl>
          </Content>
        </Container>
      </Main>
      <CloseButton
        role="button"
        className="close"
        onClick={() => onClose && onClose()}
      >
        <CloseRoundedIcon
          fontSize={"small"}
          sx={{
            fontSize: 20 / 16 + 'em',
            display: 'block',
          }}
        />
      </CloseButton>
    </Wrapper>
  );
}

export default forwardRef(Explanation)