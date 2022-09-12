import { useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from "@mui/material"
import BottomNav from '../components/BottomNav'
import NProgress from 'nprogress'
import { themeOptions } from '@wrp/core'
import {
    GoogleAnalytics,
    // TidioChat,
    TawkWidget
} from "../components/Integration"
import KeepAlivePage from '../components/KeepAlivePage'
import { imgFallback } from '../utils/image'
import { reducer, initialState, RootContext } from '../store'

import '../styles/nprogress.scss'
import '../styles/global.css'

NProgress.configure({ showSpinner: false })

const theme = createTheme(themeOptions)


export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        router.prefetch('/reading')
        router.prefetch('/explore')
        // router.prefetch('/word')
        // router.prefetch('/start')
        // router.prefetch('/about')

        function handleRouterChangeStart() {
            NProgress.start()
        }

        function handleRouterChangeDone() {
            NProgress.done()
        }

        const cancelImgFallback = imgFallback()
        router.events.on('routeChangeStart', handleRouterChangeStart)
        router.events.on('routeChangeComplete', handleRouterChangeDone)
        router.events.on('routeChangeError', handleRouterChangeDone)
        return () => {
            router.events.off('routeChangeStart', handleRouterChangeStart)
            router.events.off('routeChangeComplete', handleRouterChangeDone)
            router.events.off('routeChangeError', handleRouterChangeDone)
            cancelImgFallback()
        }
    }, [])

    return (
        <>
            <Head>
                <meta
                    name='viewport'
                    content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
                />
                <title>青轻阅读 Deep Reading - 轻松阅读英语</title>
            </Head>

            <GoogleAnalytics />
            <TawkWidget path={router.asPath} />

            <ThemeProvider theme={theme}>
                <RootContext.Provider value={{ state: state, dispatch: dispatch }}>
                    {/* <Component {...pageProps} /> */}
                    <KeepAlivePage Component={Component} pageProps={pageProps} />
                    <BottomNav />
                </RootContext.Provider>
            </ThemeProvider>
        </>
    )
}
