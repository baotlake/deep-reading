/// <reference path="../../../module.d.ts" />

import { useContext } from 'react'
import { setSetting } from '@wrp/core'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import BlockIcon from '@mui/icons-material/Block'
import styled from '@emotion/styled'
import { JavaScriptIcon, BlockJavaScriptIcon } from './Icon'
import { ViewContext } from '../ViewContext'
import { setSameOrigin, setScript } from '../reducer'
import { SETTING_SCRIPT, SETTING_SAME_ORIGIN } from '../utils/key'
import type { initialState } from '../reducer'

const Title = styled.div`
    font-size: 16px;
`

const Text = styled.div`
    font-size: 12px;
    margin-top: 5px;
`

type Toggle = (typeof initialState)['options']['script']


export function Options() {

    const { state: {
        noScript,
        allowSameOrigin,
        options,
    }, dispatch } = useContext(ViewContext)

    const handleScriptChange = (e: React.MouseEvent, value: Toggle) => {
        console.log('script', e, value)
        value = value || 'auto'
        dispatch && dispatch(setScript(value))
        setSetting({
            key: SETTING_SCRIPT,
            value: value,
        })
    }

    const handleSameOriginChange = (e: React.MouseEvent, value: Toggle) => {
        value = value || 'auto'
        dispatch && dispatch(setSameOrigin(value))
        setSetting({
            key: SETTING_SAME_ORIGIN,
            value: value,
        })
    }

    return (
        <Box sx={{ marginTop: '20px' }}>
            <Box sx={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
            }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingBottom: '10px',
                        borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}
                >
                    <div>
                        <Title>
                            JavaScript选项
                        </Title>
                        <Text>
                            {
                                options.script === 'auto' ? '自动选择 (推荐)' :
                                    options.script === 'allow' ? '允许，页面可交互' :
                                        options.script === 'block' ? '禁用，阻止页面跳转' : ''
                            }
                        </Text>
                    </div>
                    <ToggleButtonGroup
                        exclusive
                        value={options.script}
                        onChange={handleScriptChange}
                    >
                        <ToggleButton value="auto" color="primary">
                            <AutorenewIcon />
                        </ToggleButton>
                        <ToggleButton value="allow" color="primary">
                            <JavaScriptIcon />
                        </ToggleButton>
                        <ToggleButton value="block" color="secondary">
                            <BlockJavaScriptIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                    }}
                >
                    <div>
                        <Title>
                            Same-Origin选项
                        </Title>
                        <Text>
                            {
                                options.sameOrigin == 'auto' ? '自动选择 (推荐)' :
                                    options.sameOrigin == 'allow' ? '允许，不安全、兼容性高' :
                                        options.sameOrigin === 'block' ? '禁用，安全、兼容性差' : ''
                            }
                        </Text>
                    </div>
                    <ToggleButtonGroup
                        exclusive
                        value={options.sameOrigin}
                        onChange={handleSameOriginChange}
                    >
                        <ToggleButton value="auto" color="primary">
                            <AutorenewIcon />
                        </ToggleButton>
                        <ToggleButton value="allow" color="error">
                            <LockOpenIcon />
                        </ToggleButton>
                        <ToggleButton value="block" color="secondary">
                            <BlockIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    )
}