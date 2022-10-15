import { useEffect, useReducer } from 'react'
import { initialState, reducer, setPopupVisible } from './reducer'
import { MessageData } from '@wrp/core'
import { addContentMessageListener } from '@wrp/inject'
import { ExtMessageData, ExtMessageType } from '../../types/message'
import { AppContext } from './context'
import { PopupCard } from './PopupCard'

export function App() {

    const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState)

    useEffect(() => {
        const handleContentMessage = (data: ExtMessageData) => {
            switch (data.type) {
                case 'showContentPopup':
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
                <PopupCard />
            </AppContext.Provider>
        </>
    )
}