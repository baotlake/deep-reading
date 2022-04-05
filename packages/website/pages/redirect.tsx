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
        router.replace('/')
        router.replace({
            pathname: pathname,
            query: search,
            hash: hash,
        })
    }, [])

    return (
        <div>
            <PageLoading />
        </div>
    )
}