import React, { useEffect, useState, useContext } from 'react'
import classNames from 'classnames'
import { MessageData } from '@wrp/core'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import { PopupContext } from '../PopupContext'
import { setGlobalTargetType, setHostTargetType, setScope } from '../reducer'
import type { State } from '../reducer'
import { Items } from './Items'
import { setHostMode } from '../../../uitls/setting'
import { sendMessage } from '../../../uitls/extension'

import {
    Wrapper,
    GlobalIcon,
    HostIcon,
    WebsiteIcon,
    StyledTab,
} from './index.style'

type TargetType = State['globalTargetType']
type Scope = State['scope']

export function ModeOption() {
    const {
        state: {
            enable,
            scope,
            hostname,
            globalTargetType,
            hostTargetType,
            activeTab,
        },
        dispatch,
    } = useContext(PopupContext)

    const handleGlobalTriggerMode = (mode: TargetType) => {
        sendMessage<MessageData>({
            type: 'setTargetType',
            payload: {
                type: mode,
                host: '*',
                activeTabId: activeTab.id,
            },
        })
        setHostMode('*', mode)
        dispatch(setGlobalTargetType(mode))
    }

    const handleHostTriggerMode = (type: TargetType) => {
        sendMessage<MessageData>({
            type: 'setTargetType',
            payload: {
                type: type,
                host: hostname,
                customized: true,
            },
        })
        setHostMode(hostname, type)
        dispatch(setHostTargetType(type, true))
    }

    const handleTabChange = (e: React.SyntheticEvent, value: Scope) => {
        const customized = value === 'host'
        sendMessage<MessageData>({
            type: 'setTargetType',
            payload: {
                type: customized ? hostTargetType : globalTargetType,
                host: customized ? hostname : '*',
                customized: customized,
                activeTabId: activeTab.id,
            },
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
                        <TabList onChange={handleTabChange}>
                            <StyledTab
                                sx={{ width: '45%' }}
                                value="global"
                                label="全局"
                                icon={<GlobalIcon fontSize="small" />}
                                iconPosition="start"
                            />
                            <StyledTab
                                sx={{
                                    width: '55%',
                                    textTransform: 'none',
                                    wordBreak: 'break-all',
                                }}
                                value="host"
                                // label={hostLabel(hostname, 240)}
                                // label={hostLabel(hostname, 18)}
                                label={'当前页'}
                                title={hostname}
                                icon={
                                    activeTab?.favIconUrl ? (
                                        <HostIcon src={activeTab?.favIconUrl} />
                                    ) : (
                                        <WebsiteIcon fontSize="small" />
                                    )
                                }
                                iconPosition="start"
                            />
                        </TabList>
                    </Box>
                    <TabPanel sx={{ padding: 0 }} value="global">
                        <Items
                            mode={globalTargetType}
                            onChange={handleGlobalTriggerMode}
                        />
                    </TabPanel>
                    <TabPanel sx={{ padding: 0 }} value="host">
                        <Items
                            mode={hostTargetType}
                            onChange={handleHostTriggerMode}
                        />
                    </TabPanel>
                </TabContext>
            </Wrapper>
        </>
    )
}
