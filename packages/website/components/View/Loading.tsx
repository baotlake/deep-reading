import CircularProgress from '@material-ui/core/CircularProgress'
import style from './loading.module.scss'

interface Props {
    href: string
}

export default function Loading(props: Props) {
    let url = new URL(props.href || 'about://blank')
    return (
        <div className={style['view-loading']}>
            <CircularProgress thickness={5} size={16} />
            <span>{url.origin}</span>
        </div>
    )
}
