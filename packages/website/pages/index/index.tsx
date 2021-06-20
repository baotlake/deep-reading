import Link from 'next/link'


export default function Index() {
    return (
        <div>
            <Link href="/home">
                <h3>home</h3>
            </Link>
            <Link href="/explore">
                <h3>explore</h3>
            </Link>
            <Link href="/reading">
                <h3>reading</h3>
            </Link>
            <Link href="/experiment/ui">
                <h3>Experiment</h3>
            </Link>
        </div>
    )
}