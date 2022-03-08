/// <reference path="../module.d.ts" />

import { useEffect, useRef } from "react"
import { BrowserQRCodeReader, IScannerControls, } from '@zxing/browser'
import type { Result, Exception } from '@zxing/library'
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import CloseIcon from '@mui/icons-material/Close'


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
        <Box
            sx={{
                position: 'fixed',
                zIndex: 11,
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: 'black',
                }}
            >
                <video width='100%' height="100%" ref={videoRef}></video>
                <IconButton
                    size="large"
                    aria-label="close & back"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        color: 'white',
                    }}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>
            </Box>
        </Box>
    )
}