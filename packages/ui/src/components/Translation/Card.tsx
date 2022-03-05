import React, { useEffect, useRef, forwardRef } from "react"
import classNames from "classnames"
import styled from "@emotion/styled"
import { useTouch } from './useTouch'

const bottom = 120


const Div = styled.div`
  pointer-events: all;
  background-color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 80vh;
  position: fixed;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: ${30 / 16 + 'em'} ${30 / 16 + 'em'} 0 0;
  box-shadow: 0px 0px ${10 / 16 + 'em'} rgba(0, 0, 0, 0.2);
  padding: ${30 / 16 + 'em'};
  box-sizing: border-box;
  top: ${'calc(100vh + ' + bottom + 'px )'};
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
    const translationEl = useRef<HTMLDivElement>(null)

    const translateY = (value: number) => {
        const target = translationEl.current
        if (!target) return;
        target.style.transition = 'all 0.3s'
        target.style.transform = `translateY(${value}px)`
        setTimeout(() => {
            target.style.transition = ''
        }, 300)
    }

    const handleScrollStop = (height: number, y: number) => {
        console.log('handleScrollStop')
        const target = translationEl.current
        if (!target) return;
        if (y > (-height - bottom) / 3) {
            translateY(0)
            onClose && onClose()
        }
    }

    useTouch({
        target: translationEl.current,
        bottom: bottom,
        onStop: handleScrollStop,
    })

    useEffect(() => {
        const target = translationEl.current
        if (target && visible === true) {
            let rect = target.getBoundingClientRect()
            translateY((-rect.height - bottom) / 1.5)
        }

        if (visible === false) {
            translateY(0)
        }
    }, [visible])

    useEffect(() => {
        if (typeof ref === "function") {
            ref(translationEl.current)
        } else if (ref !== null) {
            ref.current = translationEl.current
        }
    }, [ref])

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
