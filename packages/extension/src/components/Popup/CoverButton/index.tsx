import React, { useContext } from 'react'
import { PopupContext } from '../PopupContext'
import { EnableAlert } from './EnableAlert'
import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/system'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import Box from '@mui/material/Box'
import { MessageData } from '@wrp/core'
import { sendMessage, updateTab } from '../../../uitls/extension'

const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: '12px 20px',
    justifyContent: 'start',
    background: 'whitesmoke',
    borderRadius: '6px',

    color: theme.palette.primary.main,

    '> span': {
        color: theme.palette.primary.dark,
    }
}))

export function CoverButton() {

    const { state: { enable, activeTab } } = useContext(PopupContext)

    const handleClick = () => {
        sendMessage<MessageData>({
            type: 'setCoverVisible',
            payload: {
                visible: true,
                tabId: activeTab.id,
            }
        }).then(() => {
            window.close()
        })
    }

    return (
        <Box className='my-6'>
            {
                enable
                    ? (
                        <Button
                            onClick={handleClick}
                        >
                            <LayersRoundedIcon className='mr-2 h-6 w-6' />
                            <span className='text-base'>打开专注蒙层</span>
                        </Button>
                    )
                    : <EnableAlert />
            }
        </Box>
    )
}