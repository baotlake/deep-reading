import { useRouter } from "next/router"
import { useEffect } from "react"
import PageLoading from "../components/PageLoading"

export default function Redirect() {
    const router = useRouter()

    useEffect(() => {
        const { hash, search } = location
        let pathname = location.pathname
        if (/^\/redirect/.test(pathname)) {
            pathname = '/start'
        }
        const searchParams = new URLSearchParams(search)
        searchParams.append('redirect', '1')
        
        router.replace({
            pathname: pathname,
            query: searchParams.toString(),
            hash: hash,
        })
    }, [])

    return (
        <div>
            <PageLoading />
        </div>
    )
}