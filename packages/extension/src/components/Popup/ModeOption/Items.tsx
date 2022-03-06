import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'

import type { State } from '../reducer'

const sx = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 20px',
    background: 'whitesmoke',
    margin: '10px 0',
    borderRadius: '6px',
}

const sxActive = {
    ...sx,
    background: 'lightblue'
}

type Props = {
    mode: State['globalTriggerMode']
    onChange?: (mode: State['globalTriggerMode']) => void
}

export function Items({ mode, onChange }: Props) {

    return (
        <>
            <ButtonBase
                sx={mode === 'all' ? sxActive : sx}
                onClick={() => onChange('all')}
            >
                <Typography variant='subtitle2' >所有内容</Typography>
                <Typography variant="caption">网页中的所有内容</Typography>
            </ButtonBase>
            <ButtonBase
                sx={mode === 'article' ? sxActive : sx}
                onClick={() => onChange('article')}
            >
                <Typography variant='subtitle2' >仅正文、标题</Typography>
                <Typography variant="caption">正文和标题部分可点击查词、翻译</Typography>
            </ButtonBase>
            <ButtonBase
                sx={mode === 'cover' ? sxActive : sx}
                onClick={() => onChange('cover')}
            >
                <Typography variant='subtitle2' >Cover模式</Typography>
                <Typography variant="caption">仅能在Cover模式下点击查词、翻译</Typography>
            </ButtonBase>
        </>
    )
}