
import type { NextComponentType, NextPageContext } from 'next'
import { useRef } from 'react'

type PageProps = {
    keepAliveKey?: string
}

type Pages = {
    key: string
    Component: NextComponentType<NextPageContext, any, PageProps>
    pageProps: PageProps
}[]

type Props = {
    Component: NextComponentType<NextPageContext, any, PageProps>
    pageProps: PageProps
}

export default function KeepAlivePage({ Component, pageProps }: Props) {

    const alivePages = useRef<Pages>([])
    const pages = alivePages.current

    let currentAliveIndex = -1

    if (pageProps.keepAliveKey) {
        currentAliveIndex = pages.findIndex(({ key }) => key === pageProps.keepAliveKey)
        if (currentAliveIndex === -1 && pages.length < 50) {
            pages.push({
                key: pageProps.keepAliveKey,
                Component,
                pageProps,
            })
            currentAliveIndex = pages.length - 1
        }
        if (currentAliveIndex !== -1) {
            pages[currentAliveIndex].Component = Component
            pages[currentAliveIndex].pageProps = pageProps
        }
    }

    console.log('keep alive page', currentAliveIndex, pageProps.keepAliveKey)

    return (
        <>
            {pages.map(({ Component: MemoComponent, pageProps: memoProps, key }, i) => {
                if (currentAliveIndex !== i) {
                    return <MemoComponent {...memoProps} key={key} keepAliveKey={pageProps.keepAliveKey} />
                }

                return <Component {...pageProps} key={key} />
            })}

            {currentAliveIndex === -1 && <Component {...pageProps} />}
        </>
    )
}