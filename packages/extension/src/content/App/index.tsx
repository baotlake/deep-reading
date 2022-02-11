import { useEffect, useReducer } from 'react'
import { initialState, reducer, setPopupVisible } from './reducer'
import { MessageData } from '@wrp/core'
import { addContentMessageListener } from '@wrp/inject'
import { ExtMessageData, ExtMessageType } from '../../types/message'
import { AppContext } from './context'
import Popup from './Popup'

export default function App() {

    const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState)

    useEffect(() => {
        const handleContentMessage = (data: MessageData | ExtMessageData) => {
            switch (data.type) {
                case ExtMessageType.showPopup:
                    dispatch(setPopupVisible(true))
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
            <AppContext.Provider value={{ state: state, dispatch: dispatch }}>
                {
                    state.popup.visible && <Popup />
                }
            </AppContext.Provider>

        </>
    )
}