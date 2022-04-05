import { useRouter } from "next/router"
import { useEffect } from "react"
import PageLoading from "../components/PageLoading"

export default function Redirect() {
    const router = useRouter()

    useEffect(() => {
        let target = location.href
        if (/^\/redirect/.test(location.pathname)) {
            target = '/'
        }
        router.replace(target)
    }, [])

    return (
        <div>
            <PageLoading />
        </div>
    )
}