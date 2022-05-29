import React, { useEffect, useState, useContext } from 'react'
import classNames from 'classnames'
import { MessageData } from '@wrp/core'

import { styled } from '@mui/system'
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
            activeTab,
        },
        dispatch
    } = useContext(PopupContext)

    const handleGlobalTriggerMode = (mode: TriggerMode) => {
        sendMessage<MessageData>({
            type: 'setTriggerMode',
            payload: {
                mode: mode,
                host: '*',
                activeTabId: activeTab.id,
            }
        })
        setHostMode('*', mode)
        dispatch(setGlobalTriggerMode(mode))
    }

    const handleHostTriggerMode = (mode: TriggerMode) => {
        sendMessage<MessageData>({
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
        const customized = value === 'host'
        sendMessage<MessageData>({
            type: 'setTriggerMode',
            payload: {
                mode: customized ? hostTriggerMode : globalTriggerMode,
                host: customized ? hostname : '*',
                customized: customized,
                activeTabId: activeTab.id,
            }
        })
        dispatch(setScope(value))
        // delete host customize setting
        !customized && setHostMode(hostname)
    }

    const hostLabel = (hostname: string, length: number) => {
        const text = hostname.replace(/^www\./, '')
        if (text.length > length) {
            return '...' + text.slice(text.length - length, text.length)
        }
        return text
    }

    return (
        <>

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
                                label={hostLabel(hostname, 24)}
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
