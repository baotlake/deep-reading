import { useEffect, useState } from 'react'
import { render } from 'react-dom'

import '../../content/index'


function App() {

    const [html, setHtml] = useState('loading...')

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const url = __DEV__ && params.get('url') || 'https://wrp.netlify.app/privacy'
        const text = __DEV__ && params.get('text') || 'none'

        if (text) {
            setHtml(text)
        }
        if (!text) {
            fetch(url).then((res) => res.text())
                .then((text) => {
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(text, 'text/html')
                    const base = doc.createElement('base')
                    base.href = new URL(url).origin
                    doc.head.insertBefore(base, doc.head.firstElementChild)
                    setHtml(doc.body.parentElement.innerHTML)
                })
        }
    }, [])

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}

const root = document.getElementById('root')
render(<App />, root)