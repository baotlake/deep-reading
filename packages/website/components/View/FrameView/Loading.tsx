import CircularProgress from '@mui/material/CircularProgress'
import style from './loading.module.scss'

interface Props {
    href: string
}

export default function Loading(props: Props) {
    let url = new URL(props.href || 'about://blank')
    return (
        <div className={style['view-loading']}>
            <CircularProgress thickness={5} size={16} />
            <span className={style['url']}>{url.origin}</span>
        </div>
    )
}
