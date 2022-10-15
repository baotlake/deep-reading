import { useContext } from 'react'
import { AppContext } from '../context'
import classNames from 'classnames'
import { setPopupVisible } from '../reducer'

import { styled } from '@mui/material/styles'
import { Popup } from '../../../components/Popup'

const Box = styled('div')({
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    background: 'rgba(255,255,255,0.3)',
    top: 0,
    left: 0,
    zIndex: 99999,
})

const Card = styled('div')({
    position: 'fixed',
    width: '300px',
    boxShadow: '0 0 10px gray',
    background: 'white',
})

export function PopupCard() {

    const { state: { popup }, dispatch } = useContext(AppContext)

    return (
        <>
            {
                popup.visible && (
                    <Box
                        className={classNames({
                            visible: popup.visible
                        })}
                        onClick={() => dispatch && dispatch(setPopupVisible(false))}
                    >
                        <Card>
                            <Popup />
                        </Card>
                    </Box>
                )
            }
        </>
    )
}