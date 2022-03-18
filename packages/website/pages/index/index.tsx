import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Index() {
    const router = useRouter()
    useEffect(() => {
        router.push('/start')
    }, [])

    return (
        <>
            <h1>Deep Reading</h1>
            <h3>点读翻译，无障碍阅读英文</h3>
            <p>新闻｜书籍｜文档｜博客</p>

            <h3>一“点” 轻松查词</h3>
            <p>再也不用担心词汇量不够了，用Deep Reading，英文原文阅读更顺滑</p>

            <h3>一“滑” 即刻翻译</h3>
            <p>翻译整句也得心应手</p>
        </>
    )
}