import { render } from 'react-dom'
import { getURL } from '../../uitls/extension'
import { Popup } from '../../components/Popup'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { themeOptions } from '@wrp/core'

if (__DEV__) {
    location.href = getURL('/dev-content.html')
}


const theme = createTheme(themeOptions)

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Popup />
        </ThemeProvider>
    )
}

const root = document.getElementById('root')

render(<App />, root)

