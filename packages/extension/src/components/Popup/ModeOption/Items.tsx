import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import classNames from 'classnames'
import { alpha } from '@mui/system'

import AllSvg from '../../../resource/icon/trigger-all.svg?svgr'
import MainSvg from '../../../resource/icon/trigger-main.svg?svgr'
import DisableSvg from '../../../resource/icon/trigger-disable.svg?svgr'

import type { State } from '../reducer'

const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: '12px 20px',
    background: 'whitesmoke',
    margin: '16px 0',
    borderRadius: '6px',
    alignItems: 'center',
    justifyContent: 'start',

    '&:hover': {
        color: theme.palette.primary.main,
    },

    '&.active': {
        background: alpha(theme.palette.primary.main, 0.15),
        color: theme.palette.primary.dark,
    }
}))

type Props = {
    mode: State['globalTriggerMode']
    onChange?: (mode: State['globalTriggerMode']) => void
}

export function Items({ mode, onChange }: Props) {

    return (
        <>
            <Button
                className={classNames({
                    active: mode === 'all'
                })}
                onClick={() => onChange('all')}
            >
                <AllSvg className='mr-2 h-6 w-6' />
                <span className='text-base' >全部内容快捷查词</span>
            </Button>
            <Button
                className={classNames({
                    active: mode === 'main'
                })}
                onClick={() => onChange('main')}
            >
                <MainSvg className='mr-2 h-6 w-6' />
                <span className='text-base' >仅标题和正文快捷查词</span>
            </Button>
            <Button
                className={classNames({
                    active: mode === 'disable'
                })}
                onClick={() => onChange('disable')}
            >
                <DisableSvg className='mr-2 h-6 w-6' />
                <span className='text-base' >关闭快捷查词</span>
            </Button>
        </>
    )
}