import Link from 'next/link'

export default function ReadingBlank() {
    return (
        <div>
            <p>
                没有正在阅读的内容，前往
                <Link href="/explore">发现</Link>页面
            </p>
        </div>
    )
}
