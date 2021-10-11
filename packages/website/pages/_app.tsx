import {useRef, useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {Analytics, Meta} from '../components/Head'
import type {AppProps} from 'next/app'
import {createTheme, ThemeProvider, adaptV4Theme} from "@mui/material";
import TrayMenu from '../components/TrayMenu'
import NProgress from 'nprogress'

import '../styles/common.scss'
import 'nprogress/nprogress.css'


// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }


NProgress.configure({showSpinner: false})

const theme = createTheme(adaptV4Theme({
    palette: {
        primary: {
            main: '#1b82fe',
        }
    }
}))

interface KeepAliveItem {
    route: string
    PageComponent: any
    current: boolean
}

export default function App({Component, pageProps}: AppProps) {
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
        router.prefetch('/home')
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
            <link ref="icon" href="favicon.png"/>
            <title>Deep Reading - 学习英语的最佳方式</title>
        </Head>
        <Analytics/>
        <Meta/>
        <ThemeProvider theme={theme}>
            {keepAlive.current.map(
                ({PageComponent, current, route}) =>
                    PageComponent && <PageComponent hidden={!current} key={route}/>
            )}
            {!isKeepAlivePage && <Component {...pageProps} />}
            <TrayMenu/>
        </ThemeProvider>
    </>;
}
