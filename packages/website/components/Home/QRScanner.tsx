/// <reference path="../../module.d.ts" />

import { useEffect, useRef } from "react"
import { BrowserQRCodeReader, IScannerControls, } from '@zxing/browser'
import { Result, Exception } from '@zxing/library'
import { IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'

import style from './qrScanner.module.scss'


type Props = {
    onClose?: () => void
    onResult?: (text: string) => void
}

export default function QRScanner({ onClose, onResult }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        let mount = true
        const codeReader = new BrowserQRCodeReader()
        let controls: IScannerControls

        function callback(result: Result | undefined, error: Exception | undefined, controls: IScannerControls) {
            // console.log(result, result?.getText())
            if (result) {
                // controls.stop()
                onResult && onResult(result.getText())
            }
        }
        videoRef.current && codeReader.decodeFromVideoDevice('', videoRef.current, callback)
            .then((scanerControls) => {
                mount ? controls = scanerControls : scanerControls.stop()
            })

        return () => {
            mount = false
            controls && controls.stop()
        }
    }, [])

    return (
        <div className={style['scaner-wrapper']}>
            <div className={style['scaner-container']}>
                <video ref={videoRef}></video>
                <IconButton
                    size="large"
                    className={style['close']}
                    aria-label="close & back"
                    onClick={onClose}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>
            </div>
        </div>
    )
}