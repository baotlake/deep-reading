import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { Blank } from './Blank'
import { Failed } from './Failed'
import type { ContentProps, InnerUrl } from './render.d'


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
        default:
            return [
                'about:failed',
                renderToStaticMarkup(<Failed {...(props ? props : {})} />)
            ]
    }
}