import { useEffect } from "react"
import { useRouter } from "next/router"
import PageLoading from "../components/PageLoading"


export default function Page() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/start')
    }, [])

    return (
        <div>
            <PageLoading />
        </div>
    )
}