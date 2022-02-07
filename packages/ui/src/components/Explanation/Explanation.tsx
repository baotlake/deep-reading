import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import SvgBorder from "./SvgBorder";
import Pronunciation from "./Pronunciation";
import Answer from "./Answer";
import classNames from "classnames";
import { WordData } from "@wrp/core";
import Skeleton from "@mui/material/Skeleton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Wrapper,
  Box,
  Main,
  Container,
  Header,
  Content,
  CloseButton,
} from "./ExplanationStyled";
import usePlace from "./usePlace";

interface PlayData {
  word: string;
  url: string;
  type: "am" | "en" | "other";
}

interface Props {
  visible: boolean;
  data: Partial<WordData>;
  status: "loading" | "success" | "failed";
  position: [number, number];
  zoom?: number;
  onClose?: () => void;
  overridePlay?: (data: PlayData) => void;
}

interface PositionState {
  left: number;
  top: number;
  rx: number;
  direction: "up" | "down";
}

export default forwardRef<HTMLDivElement, Props>(function Explanation(
  { visible, data, status, position, onClose, zoom, overridePlay },
  ref
) {
  if (!data) data = {};
  const innerRef = useRef<HTMLDivElement>(null)
  const place = usePlace(innerRef, position)

  useEffect(() => {
    if (innerRef.current) {
      if (typeof ref === "function") {
        ref(innerRef.current);
      } else if (ref !== null) {
        ref.current = innerRef.current;
      }
    }
  }, [ref])

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
      <Box className="border-box">
        <SvgBorder
          ratioX={place.rx}
          direction={place.direction}
        />
      </Box>
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
          }}
        />
      </CloseButton>
    </Wrapper>
  );
});
