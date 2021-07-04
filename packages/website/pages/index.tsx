import {useEffect} from "react";
import {useRouter} from "next/router";
// import Index from './index/index'
// export default Index

export default function Index() {
    const router = useRouter()
    useEffect(() => {
        router.push('/home')
    }, [])

    return (
        <></>
    )
}