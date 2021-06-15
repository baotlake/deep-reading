import { useRef, useEffect, memo, FunctionComponent } from 'react'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { useStore } from '../store'

import TrayMenu from '../components/TrayMenu'
import '../styles/common.scss'

interface KeepAliveItem {
    route: string
    PageComponent: FunctionComponent<{ hidden: boolean }>
    current: boolean
}

export default function App({ Component, pageProps }) {
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
    ])
    const store = useStore(pageProps.initialReduxState)

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

    return (
        <>
            <Provider store={store}>
                {keepAlive.current.map(
                    ({ PageComponent, current }) =>
                        PageComponent && <PageComponent hidden={!current} />
                )}
                {!isKeepAlivePage && <Component {...pageProps} />}
                <TrayMenu />
            </Provider>
        </>
    )
}
