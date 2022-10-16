import { useEffect, useReducer } from 'react'
import { getActiveTab, getSyncStorage } from '../../uitls/extension'
import { getHostMode } from '../../uitls/setting'
import {
    initialState,
    reducer,
    setEnable,
    setActiveTab,
    setMode,
} from './reducer'
import { ModeOption } from './ModeOption'
// import { EnableToggle } from './EnableToggle'
import { Header } from './Header'
import { PopupContext } from './PopupContext'
import { CoverOrEnable } from './CoverOrEnable'
import { Footer } from './Footer'
import { ExtMessageData, SyncStorage } from '../../types'
import { sendMessage, setSyncStorage } from '../../uitls/extension'
import { Main } from './index.style'

type Tab = chrome.tabs.Tab
type Props = {
    tab?: Tab
    afterShowCover?: () => void
}

export function Popup({ tab, afterShowCover }: Props) {

    const [state, dispatch] = useReducer(reducer, initialState)

    if (tab && !state.activeTab) {
        dispatch(setActiveTab(tab))
    }

    useEffect(() => {
        if (chrome.tabs) {
            getActiveTab()
                .then((tab) => {
                    dispatch(setActiveTab(tab))
                })
        }
        getSyncStorage<SyncStorage>({ enable: true })
            .then(({ enable }) => {
                dispatch(setEnable(enable))
            })
    }, [])

    useEffect(() => {
        if (state.hostname) {
            getHostMode(['*', state.hostname]).then(([global, tab]) => {
                console.log(global, tab)
                dispatch(setMode(global.mode, tab.mode, tab.customized))
            })
        }
    }, [state.hostname])

    const handleClickCoverButton = () => {
        sendMessage<ExtMessageData>({
            type: 'setCoverVisible',
            payload: {
                visible: true,
                tabId: state.activeTab?.id,
            }
        }).then(() => {
            afterShowCover && afterShowCover()
        })
    }

    const handleOnOff = () => {
        const value = !state.enable
        setSyncStorage<SyncStorage>({ enable: value })
        dispatch(setEnable(value))
        sendMessage<ExtMessageData>({ type: value ? 'enable' : 'disable' })
    }

    return (
        <PopupContext.Provider value={{ state: state, dispatch: dispatch }}>
            <Main>
                <Header
                    enable={state.enable}
                    logoUrl='https://wrp.netlify.app'
                    handleOnOff={handleOnOff}
                />
                <CoverOrEnable
                    enable={state.enable}
                    onClickCover={handleClickCoverButton}
                    onClickEnable={handleOnOff}
                />
                <ModeOption />
                <Footer />
            </Main >
        </PopupContext.Provider>
    )
}

export default Popup
