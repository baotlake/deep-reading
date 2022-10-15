import React, { useContext } from 'react'
import { PopupContext } from '../PopupContext'
import { EnableAlert } from './EnableAlert'
import { MessageData } from '@wrp/core'
import { sendMessage, updateTab } from '../../../uitls/extension'
import { Box, Button, LayersIcon } from './index.style'

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
                            <LayersIcon />
                            <span>打开专注蒙层</span>
                        </Button>
                    )
                    : <EnableAlert />
            }
        </Box>
    )
}