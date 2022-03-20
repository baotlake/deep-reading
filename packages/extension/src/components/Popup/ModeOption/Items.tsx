import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import classNames from 'classnames'

import type { State } from '../reducer'

const Button = styled(ButtonBase)(({ theme }) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 20px',
    background: 'whitesmoke',
    margin: '10px 0',
    borderRadius: '6px',

    '&:hover': {
        color: theme.palette.primary.main,
    },

    '&.active': {
        background: theme.palette.primary.main,
        color: 'white',
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
                <Typography variant='subtitle2' >所有内容</Typography>
                <Typography variant="caption">网页中的所有内容</Typography>
            </Button>
            <Button
                className={classNames({
                    active: mode === 'article'
                })}
                onClick={() => onChange('article')}
            >
                <Typography variant='subtitle2' >仅正文、标题</Typography>
                <Typography variant="caption">正文和标题部分可点击查词、翻译</Typography>
            </Button>
            <Button
                className={classNames({
                    active: mode === 'cover'
                })}
                onClick={() => onChange('cover')}
            >
                <Typography variant='subtitle2' >Cover模式</Typography>
                <Typography variant="caption">仅能在Cover模式下点击查词、翻译</Typography>
            </Button>
        </>
    )
}