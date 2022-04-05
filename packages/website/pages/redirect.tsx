import { useRouter } from "next/router"
import { useEffect } from "react"
import PageLoading from "../components/PageLoading"

export default function Redirect() {
    const router = useRouter()

    useEffect(() => {
        let pathname = location.pathname
        if (/^\/redirect/.test(pathname)) {
            pathname = '/start'
        }
        router.replace({
            pathname: pathname,
            query: location.search,
            hash: location.hash,
        })
    }, [])

    return (
        <div>
            <PageLoading />
        </div>
    )
}