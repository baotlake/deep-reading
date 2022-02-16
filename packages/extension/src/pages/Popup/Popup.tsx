import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Paper from '@mui/material/Paper'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'

import { TriggerMode } from '@wrp/core'
import { getActiveTab, sendMessage, sendMessageToTab, setSyncStorage } from '../../uitls/extension'
import { ExtMessageData } from '../../types/message'
import { getEnable } from '../../uitls/setting'
import { ENABLE_KEY } from '../../uitls/key'

import './popup.scss'

const sxOption = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '15px 25px',
    background: 'whitesmoke',
    margin: '10px 0',
}

export function App() {

    const [activeTab, setActiveTab] = useState<chrome.tabs.Tab>(null)
    const [modeTab, setModeTab] = useState('default')
    const [enable, setEnable] = useState(true)

    const setMode = (mode: TriggerMode) => {
        const tabId = activeTab?.id

        tabId && sendMessageToTab<ExtMessageData>(tabId, {
            type: 'setTriggerMode',
            payload: {
                mode: mode,
            }
        })

    }

    const hanldeClickEnableButton = () => {
        const newValue = !enable
        setSyncStorage({ [ENABLE_KEY]: newValue })
        setEnable(newValue)
        sendMessage<ExtMessageData>({ type: newValue ? 'enable' : 'disable' })
    }

    useEffect(() => {
        getActiveTab().then((tab) => {
            setActiveTab(tab)
        })
        getEnable().then((value) => {
            setEnable(value)
        })
    }, [])

    return (
        <Box sx={{ padding: '25px', minWidth: '300px', boxSizing: 'border-box' }} >
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '25px'
                }}
            >
                <div>
                    <Typography variant='subtitle1' >{enable ? '关闭Extension' : '开启Extension'}</Typography>
                    <Typography variant="caption">快捷键 ⌥⇧D</Typography>
                </div>
                <Button
                    startIcon={<PowerSettingsNewIcon />}
                    variant={enable ? "outlined" : "contained"}
                    onClick={hanldeClickEnableButton}
                >{enable ? '关闭' : '开启'}</Button>
            </Paper>
            <Box>
                <TabContext value={modeTab}>
                    <Box
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <TabList
                            onChange={(e, newTab) => setModeTab(newTab)}
                        >
                            <Tab sx={{ width: '45%' }} value="default" label="全局" />
                            <Tab
                                sx={{
                                    width: '55%',
                                    textTransform: 'none',
                                    wordBreak: 'break-all',
                                }}
                                value="origin"
                                label={activeTab?.url ? new URL(activeTab?.url).hostname : ''}
                            />
                        </TabList>
                    </Box>
                    <TabPanel sx={{ padding: 0 }} value="default">
                        <ButtonBase sx={sxOption} onClick={() => setMode('all')}>
                            <Typography variant='subtitle2' >所有内容</Typography>
                            <Typography variant="caption">网页中的所有内容</Typography>
                        </ButtonBase>
                        <ButtonBase sx={sxOption} onClick={() => setMode('article')} >
                            <Typography variant='subtitle2' >仅正文、标题</Typography>
                            <Typography variant="caption">正文和标题部分可点击查词、翻译</Typography>
                        </ButtonBase>
                        <ButtonBase sx={sxOption} onClick={() => setMode('cover')}>
                            <Typography variant='subtitle2' >Cover模式</Typography>
                            <Typography variant="caption">仅能在Cover模式下点击查词、翻译</Typography>
                        </ButtonBase>
                    </TabPanel>
                    <TabPanel sx={{ padding: 0 }} value='origin'>
                        <ButtonBase sx={sxOption} onClick={() => setMode('all')}>
                            <Typography variant='subtitle2' >所有内容</Typography>
                            <Typography variant="caption">网页中的所有内容</Typography>
                        </ButtonBase>
                        <ButtonBase sx={sxOption} onClick={() => setMode('article')} >
                            <Typography variant='subtitle2' >仅正文、标题</Typography>
                            <Typography variant="caption">正文和标题部分可点击查词、翻译</Typography>
                        </ButtonBase>
                        <ButtonBase sx={sxOption} onClick={() => setMode('cover')}>
                            <Typography variant='subtitle2' >Cover模式</Typography>
                            <Typography variant="caption">仅能在Cover模式下点击查词、翻译</Typography>
                        </ButtonBase>
                    </TabPanel>
                </TabContext>

            </Box >
        </Box >
    )
}


export default App