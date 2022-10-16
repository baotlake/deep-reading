import { render } from 'react-dom'
import { Popup } from '../../components/Popup'
import { ExtMessageData } from '../../types'
import { sendMessage } from '../../uitls/extension'
import { createTheme, ThemeProvider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { themeOptions } from '@wrp/core'

import '../../style/global.css'

const Box = styled('div')({
    fontSize: '16px',
    width: '18.75em',
    margin: 'auto',
    outline: '1px solid rgba(0,0,0,0.1)',
})

const theme = createTheme(themeOptions)

function App() {

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Popup
                    afterShowCover={() => window.close()}
                />
            </Box>
        </ThemeProvider>
    )
}

const target = document.querySelector('#root')
render(<App />, target)

sendMessage<ExtMessageData>({ type: 'popupActive' })
