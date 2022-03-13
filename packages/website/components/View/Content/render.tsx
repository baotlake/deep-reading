import { renderToStaticMarkup } from 'react-dom/server'
import Blank from './Blank'
import Failed from './Failed'
import type { ContentProps, InnerUrl } from './render.d'

export function renderUrl(url: InnerUrl, props?: ContentProps<any>) {
    switch (url) {
        case '':
        case 'about:blank':
            return [
                'about:blank',
                renderToStaticMarkup(<Blank />)
            ]
        case 'about:failed':
        default:
            return [
                'about:failed',
                renderToStaticMarkup(<Failed {...(props ? props : {})} />)
            ]
    }
}