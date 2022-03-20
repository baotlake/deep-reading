import { render } from 'react-dom'
import { Popup } from '../../components/Popup'
import { ExtMessageData } from '../../types'
import { sendMessage } from '../../uitls/extension'
import { createTheme, ThemeProvider } from '@mui/material'
import { themeOptions } from '@wrp/core'

const theme = createTheme(themeOptions)

function App() {

    return (
        <ThemeProvider theme={theme}>
            <Popup />
        </ThemeProvider>
    )
}

const target = document.querySelector('#root')
render(<App />, target)

sendMessage<ExtMessageData>({ type: 'popupActive' })

