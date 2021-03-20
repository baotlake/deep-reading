import { useEffect } from 'react'

export default function Analytics() {

    useEffect(()=>{
        const script = document.createElement('script')
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-51ND7RKJMM'
        const script2 = document.createElement('script')
        script2.innerText = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-51ND7RKJMM');
        `.replaceAll('\n', '')

        if (process.env.NODE_ENV === 'production') {
            document.head.appendChild(script)
            document.head.appendChild(script2)
        }

    }, [])
    
    return <></>
}