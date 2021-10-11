import {forwardRef, useEffect, useState, useRef} from "react";
import classNames from 'classnames'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import style from './box.scss?raw'

interface Props {
    visible: boolean
    data: any
    positionRect?: DOMRect
    onClose?: () => void
}

export default forwardRef<HTMLDivElement, Props>(function TranslateBox(props, ref) {

    const innerRef = useRef<HTMLDivElement>()
    const dataRef = useRef({
        width: 0,
        height: 0,
    })
    useEffect(() => {
        if (typeof ref === 'function') {
            ref(innerRef.current)
        } else if (ref) {
            ref.current = innerRef.current
        }
    }, [ref])

    useEffect(() => {
        const rect = innerRef.current.getBoundingClientRect()
        dataRef.current.width = rect.width
        dataRef.current.height = rect.height

        const rangeRect = props.positionRect

        if (rangeRect) {
            let left = (rangeRect.width / 2 + rangeRect.left) - rect.width / 2
            if (left < 20) left = 20
            const maxLeft = window.innerWidth - rect.width - 20
            if (left > maxLeft) left = maxLeft

            let top = rangeRect.bottom + 20
            const maxTop = window.innerHeight - rect.height - 20
            if (top > maxTop) top = maxTop

            innerRef.current.style.left = Math.round(left) + 'px'
            innerRef.current.style.top = Math.round(top) + 'px'
        }
    }, [props.positionRect])

    return (
        <>
            <style>{style}</style>
            <div
                ref={innerRef}
                className={classNames('translate-box', {visible: props.visible})}
            >
                <div className={'close-button'} onClick={props.onClose}>
                    <CloseRoundedIcon fontSize={'small'}/>
                </div>
                <div>{props.data?.original}</div>
                <br/>
                <div>{props.data?.translation}</div>
            </div>
        </>
    )
})
