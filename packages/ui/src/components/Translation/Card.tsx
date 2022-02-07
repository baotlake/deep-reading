import React, { useEffect, useRef, forwardRef } from "react"
import classNames from "classnames"
import styled from "@emotion/styled"

const Div = styled.div`
  pointer-events: all;
  background-color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 70vh;
  position: fixed;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: ${30 / 16 + 'em'} ${30 / 16 + 'em'} 0 0;
  box-shadow: 0px 0px ${10 / 16 + 'em'} rgba(0, 0, 0, 0.2);
  padding: ${30 / 16 + 'em'};
  box-sizing: border-box;
  top: 120%;
  overscroll-behavior: none;
`;

const Handle = styled.div`
  position: absolute;
  width: ${46 / 16 + 'em'}; 
  box-sizing: border-box;
  top: ${10 / 16 + 'em'};
  left: 50%;
  transform: translateX(-50%);

  > div {
    background-color: #eaeaea;
    display: block;
    width: 100%;
    height: ${4 / 16 + 'em'};
    border-radius: ${2 / 16 + 'em'};
  }
`;

interface Props {
    visible: boolean | number
    onClose?: () => void
    data: any
}

function Card(
    { visible, data, onClose }: Props,
    ref: React.ForwardedRef<HTMLDivElement>
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
            // e.preventDefault();
            // e.stopPropagation();
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
            // e.stopPropagation();
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
            // e.preventDefault();
            // e.stopPropagation();
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
            let rect = translationEl.current?.getBoundingClientRect();
            refData.current.height = rect?.height || refData.current.height
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
            <Div
                ref={translationEl}
                className={classNames("wrp-translation", { visible: visible })}
                // onClick={props.handleClick}
                data-wrp-action="no-tapBlank no-translate no-lookup"
            >
                <Handle>
                    <div />
                </Handle>

                <div
                    className=""
                    data-wrp-action="lookup"
                >{data?.original}</div>
                <br />
                <div className="">{data?.translated}</div>
            </Div>
        </>
    );
}

export default forwardRef<HTMLDivElement, Props>(Card)
