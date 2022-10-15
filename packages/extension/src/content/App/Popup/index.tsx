import { useContext } from 'react'
import { AppContext } from '../context'
import classNames from 'classnames'
import { setPopupVisible } from '../reducer'

import { styled } from '@mui/material/styles'

const Box = styled('div')`
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    height: 320px;
    border-radius: 4px;
    background: whitesmoke;
    box-shadow: 0 0 10px #aaa;
`


export default function Popup() {

    const { state: { popup }, dispatch } = useContext(AppContext)

    return (
        <Box
            className={classNames({
                visible: popup.visible
            })}
            onClick={() => dispatch && dispatch(setPopupVisible(false))}
        >
            ✅
        </Box>
    )
}