import { useContext, useEffect, useRef } from 'react'
import { useEscapeHide } from '@wrp/ui'
import { AppContext } from '../context'
import classNames from 'classnames'
import { setPopupVisible } from '../reducer'
import { Popup } from '../../../components/Popup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { Box, Card } from './index.style'


export function PopupCard() {

    const { state: { popup, tab }, dispatch } = useContext(AppContext)

    useEscapeHide(popup.visible, () => {
        dispatch(setPopupVisible(false))
    })

    const handleClickAway = () => {
        dispatch(setPopupVisible(false))
    }

    return (
        <>
            {
                popup.visible && (
                    <Box
                        className={classNames({
                            visible: popup.visible
                        })}
                    >
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Card>
                                <Popup
                                    tab={tab}
                                    afterShowCover={() => dispatch(setPopupVisible(false))}
                                />
                            </Card>
                        </ClickAwayListener>
                    </Box>
                )
            }
        </>
    )
}