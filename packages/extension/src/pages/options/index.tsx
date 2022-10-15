import { render } from 'react-dom'
import { getURL, setPopup } from '../../uitls/extension'
import { Popup } from '../../components/Popup'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { themeOptions } from '@wrp/core'

import { Switch } from '@mui/material'

if (__DEV__) {
    // location.href = getURL('/dev-content.html')
}


const theme = createTheme(themeOptions)

function App() {

    const handleChange = (value: boolean) => {
        if (value) {
            setPopup({
                popup: '',
            })
        } else {
            setPopup({
                popup: '/popup.html'
            })
        }
    }

    return (
        <ThemeProvider theme={theme}>
            {/* <Popup /> */}

            <div>
                Content Popup

                <Switch value={false} onChange={(e, checked) => handleChange(checked)} />

            </div>
        </ThemeProvider>
    )
}

const root = document.getElementById('root')

render(<App />, root)

