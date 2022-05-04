import { renderToStaticMarkup } from 'react-dom/server'
import { Blank } from './Blank'
import { Failed } from './Failed'
import { SSR } from './SSR'
import type { ContentProps, InnerUrl } from './render.d'

// import script from './SSR.tsx?raw'


function SSRDom() {
    return (
        <html>
            <head>
                <script>{}</script>
            </head>
            <body>
                <SSR />
            </body>
        </html>
    )
}

export function renderUrl(url: InnerUrl, props?: ContentProps<any>) {
    console.log('renderUrl : ', url)
    switch (url) {
        case '':
        case 'about:blank':
            return [
                'about:blank',
                renderToStaticMarkup(<Blank />)
            ]
        case 'about:failed':
            return [
                'about:failed',
                renderToStaticMarkup(<Failed {...(props ? props : {})} />)
            ]
        case 'about:ssr':
            return [
                'about:ssr',
                renderToStaticMarkup(<SSRDom />),
            ]
        default:
            return [
                'about:failed',
                renderToStaticMarkup(<Failed {...(props ? props : {})} />)
            ]
    }
}