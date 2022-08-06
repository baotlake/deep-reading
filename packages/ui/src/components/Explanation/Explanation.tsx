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
} from "./Explanation.style";
import usePlace from "./usePlace";

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

  useEffect(() => {
    let id: number
    if (visible && status === 'success' && !data?.answer?.length) {
      id = window.setTimeout(() => onClose && onClose(), 1000)
    }

    const wrapper = innerRef.current

    const handleClick = (e: MouseEvent) => {
      const target = e.composedPath()[0] as HTMLElement
      // console.warn('click', target, e, wrapper)
      if (wrapper && !wrapper.contains(target)) {
        onClose && onClose()
      }
    }

    if (visible) {
      window.addEventListener('click', handleClick)
    }

    return () => {
      clearTimeout(id)
      if (visible) {
        window.removeEventListener('click', handleClick)
      }
    }
  }, [visible, status, data])

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
