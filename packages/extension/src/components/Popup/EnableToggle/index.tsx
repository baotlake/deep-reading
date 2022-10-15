import { useContext } from 'react'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { sendMessage, setSyncStorage } from '../../../uitls/extension'
import { ExtMessageData } from '../../../types/message'
import { setEnable } from '../reducer'
import { PopupContext } from '../PopupContext'
import { SyncStorage } from '../../../types'


export function EnableToggle() {

    const { state, dispatch } = useContext(PopupContext)

    const hanldeClick = () => {
        const newValue = !state.enable
        console.log('enable newValue', newValue)
        setSyncStorage<SyncStorage>({ enable: newValue })
        dispatch(setEnable(newValue))
        sendMessage<ExtMessageData>({ type: newValue ? 'enable' : 'disable' })
    }

    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <div>
                <Typography variant='subtitle1' >
                    {state.enable ? '已启用' : '未启用'}
                </Typography>
                <Typography variant="caption">
                    {state.enable ? '青轻阅读，秒查词，秒翻译' : '点击右侧开关启用'}
                </Typography>
            </div>
            <Button
                startIcon={<PowerSettingsNewIcon />}
                variant={state.enable ? "outlined" : "contained"}
                onClick={hanldeClick}
            >{state.enable ? '关闭' : '启用'}</Button>
        </Paper>
    )
}