/// <reference path="../module.d.ts" />

import { useEffect, useRef } from "react"
import Box from "@mui/material/Box"
import { BrowserQRCodeReader, IScannerControls, } from '@zxing/browser'
import type { Result, Exception } from '@zxing/library'



type Props = {
    onResult?: (text: string) => void
}

export default function QRScanner({ onResult }: Props) {
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
                controls = scanerControls
                !mount && scanerControls.stop()
            })

        return () => {
            mount = false
            controls && controls.stop()
        }
    }, [])

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
            >
                <video
                    className="object-cover w-full h-full"
                    width='100%'
                    height="100%"
                    ref={videoRef}
                />
                <Box
                    className="absolute w-full h-full inset-0"
                    sx={{
                        // boxShadow: ` inset 0 0 999px rgba(0,0,0,0.3)`,
                        // background: `radial-gradient(rgba(0,0,0,0), rgba(0,0,0,0.2))`,
                    }}
                />
            </Box>
        </>
    )
}