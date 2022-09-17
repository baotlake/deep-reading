
import { useRef } from 'react'
import type { AppProps } from 'next/app'

type Pages = {
    key: string
    Component: AppProps['Component']
    pageProps: AppProps['pageProps']
}[]

type Props = {
    Component: AppProps['Component']
    pageProps: AppProps['pageProps']
    keepAliveKey?: string | false
}

export default function KeepAlivePage({ Component, pageProps, keepAliveKey }: Props) {

    const alivePages = useRef<Pages>([])
    const pages = alivePages.current

    let currentAliveIndex = -1

    if (keepAliveKey) {
        currentAliveIndex = pages.findIndex(({ key }) => key === keepAliveKey)
        if (currentAliveIndex === -1 && pages.length < 50) {
            pages.push({
                key: keepAliveKey,
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

    return (
        <>
            {pages.map(({ Component: MemoComponent, pageProps: memoProps, key }, i) => {
                if (currentAliveIndex !== i) {
                    return <MemoComponent
                        {...memoProps}
                        key={key}
                        keepAliveKey={keepAliveKey}
                    />
                }

                return <Component {...pageProps} key={key} keepAliveKey={keepAliveKey} />
            })}

            {currentAliveIndex === -1 && <Component {...pageProps} />}
        </>
    )
}