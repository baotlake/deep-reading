/// <reference path="../../../module.d.ts" />

import { useContext } from 'react'
import { setSetting } from '@wrp/core'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import AutorenewIcon from '@mui/icons-material/Autorenew'
// import BlockIcon from '@mui/icons-material/Block'
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
// import CodeOffOutlinedIcon from '@mui/icons-material/CodeOffOutlined'
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined'
import styled from '@emotion/styled'
import { ViewContext } from '../ViewContext'
import { setSameOrigin, setScript, setReaderMode } from '../reducer'
import {
    SETTING_AUTO_READER_MODE,
    SETTING_READER_MODE,
    SETTING_AUTO_ALLOW_SCRIPT,
    SETTING_ALLOW_SCRIPT,
    SETTING_AUTO_ALLOW_SAME_ORIGIN,
    SETTING_ALLOW_SAME_ORIGIN
} from '../utils/key'
import { useRouter } from 'next/router'

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


export function Options() {

    const { state: {
        // allowScript,
        // allowSameOrigin,
        // readerMode,
        options,
    }, dispatch } = useContext(ViewContext)

    const router = useRouter()

    // const isReaderMode = options.readerMode === 'y' || (options.readerMode === '' && readerMode)
    const isReaderMode = options.readerMode > 0
    // const isAllowScript = options.allowScript === 'y' || (options.allowScript === '' && allowScript)
    const isAllowScript = options.allowScript > 0
    // const isAllowSameOrigin = options.allowSameOrigin === 'y' || (options.allowSameOrigin === '' && allowSameOrigin)
    const isAllowSameOrigin = options.allowSameOrigin > 0

    const handleReaderModeChange = (e: React.MouseEvent, value: string[]) => {
        console.log('handleReaderModeChange', e, value)
        const auto = value.includes('auto')
        const on = value.includes('on')
        const weight = isReaderMode === on ? options.readerMode : on ? 5 : -5

        dispatch && dispatch(setReaderMode(weight, auto))
        router.replace({
            query: {
                ...router.query,
                r: weight,
            }
        })
        setSetting({
            key: SETTING_AUTO_READER_MODE,
            value: auto,
        })
        !auto && setSetting({
            key: SETTING_READER_MODE,
            value: weight,
        })
    }

    const handleScriptChange = (e: React.MouseEvent, value: string[]) => {
        console.log('handleScriptChange', e, value)
        const auto = value.includes('auto')
        const on = value.includes('on')
        const weight = isAllowScript === on ? options.allowScript : on ? 5 : -5

        dispatch && dispatch(setScript(weight, auto))
        router.replace({
            query: {
                ...router.query,
                s: weight,
            }
        })
        setSetting({
            key: SETTING_AUTO_ALLOW_SCRIPT,
            value: auto,
        })
        !auto && setSetting({
            key: SETTING_ALLOW_SCRIPT,
            value: weight,
        })
    }

    const handleSameOriginChange = (e: React.MouseEvent, value: string[]) => {
        const auto = value.includes('auto')
        const on = value.includes('on')
        const weight = isAllowSameOrigin === on ? options.allowSameOrigin : on ? 5 : -5

        dispatch && dispatch(setSameOrigin(weight, auto))
        router.replace({
            query: {
                ...router.query,
                o: weight,
            }
        })
        setSetting({
            key: SETTING_AUTO_ALLOW_SAME_ORIGIN,
            value: auto,
        })
        !auto && setSetting({
            key: SETTING_ALLOW_SAME_ORIGIN,
            value: weight,
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