import React, { useEffect, useState, useContext } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import { PopupContext } from '../PopupContext'
import { setGlobalTriggerMode, setHostTriggerMode, setScope } from '../reducer'
import type { State } from '../reducer'
import { Items } from './Items'
import { setHostMode } from '../../../uitls/setting'
import { sendMessage } from '../../../uitls/extension'
import { ExtMessageData } from '../../../types'
import { styled } from '@mui/system'
import { EnableAlert } from './EnableAlert'
import classNames from 'classnames'

type TriggerMode = State['globalTriggerMode']
type Scope = State['scope']

const Wrapper = styled(Box)({
    position: 'relative',

    '&.inactive': {
        opacity: 0.3,
        filter: 'grayscale(1)',
    }
})

export function ModeOption() {
    const {
        state:
        {
            enable,
            scope,
            hostname,
            globalTriggerMode,
            hostTriggerMode,
        },
        dispatch
    } = useContext(PopupContext)

    const handleGlobalTriggerMode = (mode: TriggerMode) => {
        sendMessage<ExtMessageData>({
            type: 'setTriggerMode',
            payload: {
                mode: mode,
                host: '*',
            }
        })
        setHostMode('*', mode)
        dispatch(setGlobalTriggerMode(mode))
    }

    const handleHostTriggerMode = (mode: TriggerMode) => {
        sendMessage<ExtMessageData>({
            type: 'setTriggerMode',
            payload: {
                mode: mode,
                host: hostname,
                customized: true,
            }
        })
        setHostMode(hostname, mode)
        dispatch(setHostTriggerMode(mode, true))
    }

    const handleTabChange = (e: React.SyntheticEvent, value: Scope) => {
        sendMessage<ExtMessageData>({
            type: 'setTriggerMode',
            payload: {
                mode: globalTriggerMode,
                host: hostname,
                customized: false,
            }
        })
        dispatch(setScope(value))
        // delete host customize setting
        value === 'global' && setHostMode(hostname)
    }

    return (
        <>
            {!enable && <EnableAlert />}
            <Wrapper className={classNames({ inactive: !enable })}>
                <TabContext value={scope}>
                    <Box
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <TabList
                            onChange={handleTabChange}
                        >
                            <Tab sx={{ width: '45%' }} value="global" label="全局" />
                            <Tab
                                sx={{
                                    width: '55%',
                                    textTransform: 'none',
                                    wordBreak: 'break-all',
                                }}
                                value="host"
                                label={hostname}
                            />
                        </TabList>
                    </Box>
                    <TabPanel sx={{ padding: 0 }} value="global">
                        <Items
                            mode={globalTriggerMode}
                            onChange={handleGlobalTriggerMode}
                        />
                    </TabPanel>
                    <TabPanel sx={{ padding: 0 }} value='host'>
                        <Items
                            mode={hostTriggerMode}
                            onChange={handleHostTriggerMode}
                        />
                    </TabPanel>
                </TabContext>
            </Wrapper >
        </>
    )
}
