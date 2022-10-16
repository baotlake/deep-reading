import { useEffect, useReducer } from 'react'
import { initialState, reducer, setPopupVisible, showContentPopup } from './reducer'
import { themeOptions } from '@wrp/core'
import { addContentMessageListener, App as CoreApp } from '@wrp/inject'
import { ExtMessageData } from '../../types/message'
import { AppContext } from './context'
import { PopupCard } from './PopupCard'
import { ThemeProvider, createTheme } from '@mui/material'
import { getURL } from "../../uitls/extension"

const theme = createTheme(themeOptions)
const contentFrameUrl = getURL('/content-frame.html')

export function App() {
    const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState)

    useEffect(() => {
        const handleContentMessage = (data: ExtMessageData) => {
            switch (data.type) {
                case 'showContentPopup':
                    dispatch(showContentPopup(data.payload.tab))
                    break
            }
        }

        const removeListener = addContentMessageListener(handleContentMessage)
        return () => {
            removeListener()
        }
    }, [])

    return (
        <>
            <ThemeProvider theme={theme}>
                <CoreApp invisibleFrameSrc={contentFrameUrl} />

                <AppContext.Provider value={{ state: state, dispatch: dispatch }}>
                    <PopupCard />
                </AppContext.Provider>
            </ThemeProvider>
        </>
    )
}
