/// <reference path="../../../module.d.ts" />

import { useContext } from 'react'
import { setSetting } from '@wrp/core'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import BlockIcon from '@mui/icons-material/Block'
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import CodeOffOutlinedIcon from '@mui/icons-material/CodeOffOutlined'
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined'
import styled from '@emotion/styled'
import { purple } from '@mui/material/colors'
import { ViewContext } from '../ViewContext'
import { setSameOrigin, setScript, setReaderMode } from '../reducer'
import { SETTING_SCRIPT, SETTING_SAME_ORIGIN, SETTING_AUTO_READER_MODE, SETTING_READER_MODE, SETTING_AUTO_ALLOW_SCRIPT, SETTING_ALLOW_SCRIPT, SETTING_AUTO_ALLOW_SAME_ORIGIN, SETTING_ALLOW_SAME_ORIGIN } from '../utils/key'

import type { initialState } from '../reducer'
import classNames from 'classnames'

const Wrapper = styled(Box)({
    marginTop: '1.25rem',
})

const Row = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75em 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
})

const Title = styled('div')({
    fontSize: '1rem',
})

const Text = styled('div')({
    fontSize: '0.75rem',
    marginTop: '0.375rem',
})


type Toggle = (typeof initialState)['options']['script']


export function Options() {

    const { state: {
        allowScript,
        allowSameOrigin,
        readerMode,
        options,
    }, dispatch } = useContext(ViewContext)

    const isReaderMode = options.readerMode === 'y' || (options.readerMode === '' && readerMode)
    const isAllowScript = options.allowScript === 'y' || (options.allowScript === '' && allowScript)
    const isAllowSameOrigin = options.allowSameOrigin === 'y' || (options.allowSameOrigin === '' && allowSameOrigin)

    const handleReaderModeChange = (e: React.MouseEvent, value: string[]) => {
        console.log('handleReaderModeChange', e, value)
        const auto = value.includes('auto')
        const on = value.includes('on')
        const opinion = isReaderMode === on ? options.readerMode : on ? 'y' : 'n'
        dispatch && dispatch(setReaderMode(auto, opinion))

        setSetting({
            key: SETTING_AUTO_READER_MODE,
            value: auto,
        })
        !auto && setSetting({
            key: SETTING_READER_MODE,
            value: opinion,
        })
    }

    const handleScriptChange = (e: React.MouseEvent, value: string[]) => {
        console.log('handleScriptChange', e, value)
        const auto = value.includes('auto')
        const on = value.includes('on')
        const opinion = isAllowScript === on ? options.allowScript : on ? 'y' : 'n'
        dispatch && dispatch(setScript(auto, opinion))
        setSetting({
            key: SETTING_AUTO_ALLOW_SCRIPT,
            value: auto,
        })
        !auto && setSetting({
            key: SETTING_ALLOW_SCRIPT,
            value: opinion,
        })
    }

    const handleSameOriginChange = (e: React.MouseEvent, value: string[]) => {
        const auto = value.includes('auto')
        const on = value.includes('on')
        const opinion = isAllowSameOrigin === on ? options.allowSameOrigin : on ? 'y' : 'n'
        dispatch && dispatch(setSameOrigin(auto, opinion))
        setSetting({
            key: SETTING_AUTO_ALLOW_SAME_ORIGIN,
            value: auto,
        })
        !auto && setSetting({
            key: SETTING_ALLOW_SAME_ORIGIN,
            value: opinion,
        })
    }

    return (
        <Wrapper>
            <Box sx={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '0 1rem',
            }}
            >
                <Row>
                    <div>
                        <Title>阅读模式</Title>
                        <Text>
                            {
                                options.autoReaderMode ? '自动选择、' : '手动选择、'
                            }
                            {
                                isReaderMode ? '当前处于阅读模式' : '当前不是阅读模式'
                            }
                        </Text>
                    </div>
                    <ToggleButtonGroup
                        value={classNames({
                            auto: options.autoReaderMode,
                            on: isReaderMode,
                        }).split(' ')}
                        onChange={handleReaderModeChange}
                    >
                        <ToggleButton value="auto" color="primary">
                            <AutorenewIcon />
                        </ToggleButton>
                        <ToggleButton value="on" color="primary">
                            <ChromeReaderModeOutlinedIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Row>
                <Row>
                    <div>
                        <Title>
                            JavaScript选项
                        </Title>
                        <Text>
                            {
                                options.autoAllowScript ? '自动选择、' : '手动选择、'
                            }
                            {
                                isAllowScript ? '已启用JS' : '已禁用JS'
                            }
                        </Text>
                    </div>
                    <ToggleButtonGroup
                        value={classNames({
                            auto: options.autoAllowScript,
                            on: isAllowScript
                        }).split(' ')}
                        onChange={handleScriptChange}
                    >
                        <ToggleButton value="auto" color="primary">
                            <AutorenewIcon />
                        </ToggleButton>
                        <ToggleButton value="on" color="primary">
                            <CodeOutlinedIcon />
                        </ToggleButton>
                        {/* <ToggleButton value="block" color="secondary">
                            <CodeOffOutlinedIcon />
                        </ToggleButton> */}
                    </ToggleButtonGroup>
                </Row>

                <Row>
                    <div>
                        <Title>
                            Same-Origin选项
                        </Title>
                        <Text>
                            {
                                options.autoAllowSameOrigin ? '自动选择、' : '手动选择、'
                            }
                            {
                                isAllowSameOrigin ? 'Cookie, storage可用' : 'Cookie, storage不可用'
                            }
                        </Text>
                    </div>
                    <ToggleButtonGroup
                        value={classNames({
                            auto: options.autoAllowSameOrigin,
                            on: isAllowSameOrigin,
                        }).split(' ')}
                        onChange={handleSameOriginChange}
                    >
                        <ToggleButton value="auto" color="primary">
                            <AutorenewIcon />
                        </ToggleButton>
                        <ToggleButton value="on" color="primary">
                            <CookieOutlinedIcon />
                        </ToggleButton>
                        {/* <ToggleButton value="block" color="secondary">
                            <BlockIcon />
                        </ToggleButton> */}
                    </ToggleButtonGroup>
                </Row>
            </Box>
        </Wrapper>
    )
}