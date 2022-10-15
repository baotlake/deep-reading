import classNames from 'classnames'
import AllSvg from '../../../resource/icon/trigger-all.svg?svgr'
import MainSvg from '../../../resource/icon/trigger-main.svg?svgr'
import DisableSvg from '../../../resource/icon/trigger-disable.svg?svgr'
import { Button } from './items.style'
import type { State } from '../reducer'

type Props = {
    mode: State['globalTargetType']
    onChange?: (mode: State['globalTargetType']) => void
}

export function Items({ mode, onChange }: Props) {
    return (
        <>
            <Button
                className={classNames({
                    active: mode === 'all',
                })}
                onClick={() => onChange('all')}
            >
                <AllSvg />
                <span>全部内容快捷查词</span>
            </Button>
            <Button
                className={classNames({
                    active: mode === 'main',
                })}
                onClick={() => onChange('main')}
            >
                <MainSvg />
                <span>仅标题和正文快捷查词</span>
            </Button>
            <Button
                className={classNames({
                    active: mode === 'none',
                })}
                onClick={() => onChange('none')}
            >
                <DisableSvg />
                <span>关闭快捷查词</span>
            </Button>
        </>
    )
}
