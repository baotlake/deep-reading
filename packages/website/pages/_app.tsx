import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from "@mui/material"
import TrayMenu from '../components/TrayMenu'
import NProgress from 'nprogress'
import { themeOptions } from '@wrp/core'
import {
    GoogleAnalytics,
    TidioChat,
    // TawkWidget
} from "../components/Integration"

import '../styles/global.scss'
import 'nprogress/nprogress.css'


NProgress.configure({ showSpinner: false })

const theme = createTheme(themeOptions)

interface KeepAliveItem {
    route: string
    PageComponent: any
    current: boolean
}

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const keepAlive = useRef<KeepAliveItem[]>([
        {
            route: '/reading',
            PageComponent: undefined,
            current: false,
        },
        {
            route: '/explore',
            PageComponent: undefined,
            current: false,
        },
        {
            route: '/word',
            PageComponent: undefined,
            current: false,
        },
    ])

    useEffect(() => {
        router.prefetch('/explore')
        router.prefetch('/reading')
        router.prefetch('/word')
        router.prefetch('/start')
        router.prefetch('/about')

        function handleRouterChangeStart() {
            NProgress.start()
        }

        function handleRouterChangeDone() {
            NProgress.done()
        }

        router.events.on('routeChangeStart', handleRouterChangeStart)
        router.events.on('routeChangeComplete', handleRouterChangeDone)
        router.events.on('routeChangeError', handleRouterChangeDone)
        return () => {
            router.events.off('routeChangeStart', handleRouterChangeStart)
            router.events.off('routeChangeComplete', handleRouterChangeDone)
            router.events.off('routeChangeError', handleRouterChangeDone)
        }
    }, [])

    useEffect(() => {
        const visiblePattern = /\/about|\/start/
        const invisiblePattern = /^\/reading|^\/word/
        const visible = !invisiblePattern.test(router.asPath)
        const tidio = window.tidioChatApi
        const handleTidioReady = () => {
            visible ? window.tidioChatApi?.show() : window.tidioChatApi?.hide()
            console.log('tidioChat-ready', visible)
        }
        if (tidio) {
            visible ? tidio.show() : tidio.hide()
        }
        if (!tidio) {
            document.addEventListener('tidioChat-ready', handleTidioReady)
        }
        return () => {
            if (!tidio) {
                document.removeEventListener('tidioChat-ready', handleTidioReady)
            }
        }
    }, [router.asPath])

    // current page
    let isKeepAlivePage = false

    keepAlive.current.forEach((data) => {
        if (router.route === data.route) {
            data.current = true
            data.PageComponent = Component
            isKeepAlivePage = true
            return
        }
        data.current = false
    })

    return <>
        <Head>
            <meta
                name='viewport'
                content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
            />
            <title>Deep Reading - 学习英语的最佳方式</title>

        </Head>

        <GoogleAnalytics />
        <TidioChat />
        {/* <TawkWidget /> */}

        <ThemeProvider theme={theme}>
            {keepAlive.current.map(
                ({ PageComponent, current, route }) =>
                    PageComponent && <PageComponent active={current} key={route} />
            )}
            {!isKeepAlivePage && <Component {...pageProps} />}
            <TrayMenu />
        </ThemeProvider>
    </>
}
