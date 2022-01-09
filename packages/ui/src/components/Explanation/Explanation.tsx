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

export default forwardRef(function Explanation(
  { visible, data, status, position, onClose, zoom, overridePlay }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  if (!data) data = {};
  const innerRef = useRef<HTMLDivElement>(null);
  const refData = useRef({
    width: 255,
    height: 120,
    arrowHeight: 30, // SVGBorder Arrow Height
    margin: 15,
  });

  const [positionState, setPositionState] = useState<PositionState>({
    left: 0,
    top: 0,
    rx: 0.5,
    direction: "up",
  });

  useEffect(() => {
    const calcPosition = () => {
      const x = position[0];
      const y = position[1];
      const width = refData.current.width;
      const height = refData.current.height;
      const windowWidth = window.innerWidth;
      const arrowHeight = refData.current.arrowHeight;
      const margin = refData.current.margin;

      let rx = 0.5;
      let left = x - width / 2;
      if (x < margin + width / 2) {
        rx = (x - margin) / width;
        left = margin;
      }
      if (x > windowWidth - margin - width / 2) {
        rx = 1 - (windowWidth - x - margin) / width;
        left = windowWidth - margin - width;
      }

      let direction: "up" | "down" = "up";
      let top = y - height - arrowHeight;
      if (y < height + margin + arrowHeight) {
        direction = "down";
        top = y + arrowHeight;
      }

      return {
        left,
        top,
        rx,
        direction,
      };
    };

    if (position) setPositionState(calcPosition());
  }, [position]);

  useEffect(() => {
    if (innerRef.current) {
      if (typeof ref === "function") {
        ref(innerRef.current);
      } else if (ref !== null) {
        ref.current = innerRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (innerRef.current) {
      let rect = innerRef.current.getBoundingClientRect();
      refData.current.width = rect.width;
      refData.current.height = rect.height;
    }
  }, []);

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
      className={classNames("wrp-explanation", positionState.direction, {
        hidden: !visible,
      })}
      style={{
        left: positionState.left,
        top: positionState.top,
      }}
      wrp-action={"no-look-up"}
    >
      <Box className="border-box">
        <SvgBorder
          ratioX={positionState.rx}
          direction={positionState.direction}
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
                    width={refData.current.width * 0.6}
                    height={22}
                  />
                  <Skeleton
                    variant="text"
                    width={refData.current.width * 0.4}
                    height={22}
                  />
                  <Skeleton
                    variant="text"
                    width={refData.current.width * 0.8}
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
        <CloseRoundedIcon fontSize={"small"} />
      </CloseButton>
    </Wrapper>
  );
});
