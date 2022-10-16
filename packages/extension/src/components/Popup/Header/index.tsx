import classNames from 'classnames'
import { Box, Logo, Button, PowerIcon, MoreIcon } from './index.style'
import { MoreMenu } from './MoreMenu'

type Props = {
    enable: boolean
    logoUrl?: string
    handleOnOff?: () => void
}

export function Header({ enable, logoUrl, handleOnOff }: Props) {
    return (
        <Box>
            <Logo onClick={() => logoUrl && open(logoUrl, '_blank')} />

            <Button
                className={classNames('warning', { primary: !enable })}
                onClick={handleOnOff}
                title={enable ? '禁用服务' : '启用服务'}
            >
                <PowerIcon fontSize="small" />
            </Button>

            <MoreMenu />
        </Box>
    )
}
