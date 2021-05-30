import { Provider } from 'react-redux'

import { useStore } from '../store'

import TrayMenu from '../components/TrayMenu'

import '../styles/common.scss'

export default function App({ Component, pageProps }) {
    const store = useStore(pageProps.initialReduxState)

    return (
        <>
            <Provider store={store}>
                <Component {...pageProps} />
                <TrayMenu />
            </Provider>
        </>
    )
}

// export default function App({ Component, pageProps }) {
//     return <Component {...pageProps} />
// }
