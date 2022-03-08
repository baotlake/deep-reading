import { useRouter } from "next/router"
import QRScanner from "../../components/QRScanner"

export default function QR() {
    const router = useRouter()

    const handleScanerResult = (text: string) => {
        const isUrl = /^https?:\/\//.test(text)
        if (isUrl) {
            navigator.vibrate(50)
            router.push('/reading?url=' + encodeURIComponent(text))
        } else {
            // 
        }
    }

    const handleClose = () => {
        router.back()
    }

    return (
        <>
            <QRScanner
                onResult={handleScanerResult}
                onClose={handleClose}
            />
        </>
    )
}