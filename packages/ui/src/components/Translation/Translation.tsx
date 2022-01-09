import React, { useEffect, useRef, forwardRef } from "react";
import classNames from "classnames";
import styled from "@emotion/styled";

// import styles from './translation.scss?raw'

const Div = styled.div`
  pointer-events: all;
  background-color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 60vh;
  position: fixed;
  border-radius: 15px 15px 0 0;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
  padding: 1.5em;
  box-sizing: border-box;
  font-size: var(--font-size);
  top: calc(100% + 20px);
  overscroll-behavior: none;
`;

const Handle = styled.div`
  position: absolute;
  width: 3.5em;
  height: 1em;
  box-sizing: border-box;
  top: 0.3em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3em;
  color: var(--t-fore-c2);
  --active-color: var(--t-back-c2);
  > div {
    background-color: var(--active-color);
    display: block;
    width: 100%;
    height: 4px;
    border-radius: 3px;
    margin-bottom: 0.3em;
  }
  &:active {
    color: var(--sc);
    --active-color: var(--sc);
  }
`;

interface Props {
    visible: boolean | number;
    onClose?: () => void;
    data: any;
}

export default forwardRef(function Translation(
    { visible, data, onClose }: Props,
    ref
) {
    const translationEl = useRef<HTMLDivElement>(null);
    const refData = useRef({
        height: 0,
        moving: false,
        startY: 0,
        startTimeStamp: 0,
        translateY: 0,
        speed: 0,
    });

    const translateY = (value: number) => {
        if (!translationEl.current) return;
        if (value > -refData.current.height - 1 && value <= 0) {
            translationEl.current.style.transform = `translateY(${value}px)`;
        }
    };

    const handleScrollEnd = () => {
        refData.current.translateY = parseInt(
            translationEl.current?.style.transform.slice(11, -3) || "0"
        );
        console.log("handle scroll end", refData.current.translateY);

        if (refData.current.translateY > -180) {
            transitionTo(refData.current.translateY, 0).then(() => {
                if (typeof onClose === "function") onClose();
                console.log("Close!");
            });
        }
    };

    const transitionTo = (from: number, to: number) => {
        refData.current.translateY = from;

        return new Promise((resolve) => {
            const refresh = () => {
                if (refData.current.translateY + 8 <= to) {
                    refData.current.translateY += 8;
                    translateY(refData.current.translateY);
                    requestAnimationFrame(refresh);
                } else {
                    translateY(to);
                    resolve(true);
                }
            };

            refresh();
        });
    };

    useEffect(() => {
        const element = translationEl.current as HTMLDivElement

        let rect = element.getBoundingClientRect();
        refData.current.height = rect.height;

        const handleTouchStart = (e: TouchEvent | MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            let y =
                (e as MouseEvent).screenY || (e as TouchEvent)["touches"][0].screenY;

            let rect = element.getBoundingClientRect();
            refData.current.height = rect.height;
            refData.current.moving = true;
            refData.current.startY = y;
            refData.current.startTimeStamp = e.timeStamp;
            refData.current.translateY = parseInt(
                element.style.transform.slice(11, -3) || "0"
            );
            refData.current.speed = 0;
        };
        const handleTouchMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            let stateData = refData.current;
            let y =
                (e as MouseEvent).screenY || (e as TouchEvent)["touches"][0].screenY;
            if (stateData.moving) {
                let offset = y - stateData.startY + stateData.translateY;
                translateY(offset);
                refData.current.speed =
                    (y - refData.current.startY) /
                    (e.timeStamp - refData.current.startTimeStamp);
            }
        };
        const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
            if (!translationEl.current) return
            e.preventDefault();
            e.stopPropagation();
            console.log("e", e, refData.current.speed);
            refData.current.moving = false;
            refData.current.translateY = parseInt(
                translationEl.current.style.transform.slice(11, -3)
            );

            inertiaMove(refData.current.speed);
        };
        const inertiaMove = (speed: number) => {
            let duration = Math.sqrt((Math.abs(speed) + 1) * 20000);
            console.log("duration", duration, speed);
            let t1 = Date.now();

            const refresh = () => {
                let spend = Date.now() - t1;
                if (spend <= duration) {
                    let offset = refData.current.translateY + spend * speed;
                    translateY(offset);
                    window.requestAnimationFrame(refresh);
                } else {
                    handleScrollEnd();
                }
            };

            refresh();
        };

        element.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        element.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        element.addEventListener("touchend", handleTouchEnd, {
            passive: false,
        });

        element.addEventListener("mousedown", handleTouchStart);
        element.addEventListener("mousemove", handleTouchMove);
        element.addEventListener("mouseup", handleTouchEnd);

        return () => {
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
            element.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    useEffect(() => {
        if (visible === true) {
            translateY(-refData.current.height / 2);
        }

        if (visible === false) {
            translateY(0);
        }
    }, [visible]);

    useEffect(() => {
        if (typeof ref === "function") {
            ref(translationEl.current);
        } else if (ref !== null) {
            ref.current = translationEl.current;
        }
    }, [ref]);

    return (
        <>
            {/* <style>{styles}</style> */}
            <Div
                ref={translationEl}
                className={classNames("wrp-translation", { visible: visible })}
            // onClick={props.handleClick}
            >
                <Handle
                // onClick={props.setTranslateY}
                >
                    <div />
                </Handle>

                <div className="">{data?.original}</div>
                <br />
                <div className="">{data?.translation}</div>
            </Div>
        </>
    );
});
