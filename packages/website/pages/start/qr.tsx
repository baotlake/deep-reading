import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import Box from '@mui/material/Box'
import IconButton from "@mui/material/IconButton"
import CircularProgress from '@mui/material/CircularProgress'
import type QRScanner from "../../components/QRScanner"

import CloseIcon from '@mui/icons-material/Close'

type QRScannerProps = Parameters<typeof QRScanner>[0]

const Loading = () => (
    <Box
        className="m-auto"
    >
        <CircularProgress sx={{ color: 'primary.light' }} size={80} />
    </Box>
)

const DynamicQRScanner = dynamic<QRScannerProps>(() => import("../../components/QRScanner"), {
    loading: Loading,
})

export default function QR() {
    const router = useRouter()

    const handleScanerResult = (text: string) => {
        const isUrl = /^https?:\/\//.test(text)
        if (isUrl) {
            router.push('/reading?url=' + encodeURIComponent(text))
            navigator.vibrate && navigator.vibrate(50)
        } else {
            // 
        }
    }

    const handleClose = () => {
        router.replace('/start')
    }

    return (
        <>
            <Box
                className="fixed flex w-screen h-screen inset-0 z-20 bg-black"
            >
                <DynamicQRScanner
                    onResult={handleScanerResult}
                />
                <IconButton
                    size="large"
                    aria-label="close & back"
                    onClick={handleClose}
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
        </>
    )
}