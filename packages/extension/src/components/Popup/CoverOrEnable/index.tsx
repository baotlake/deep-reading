import React from 'react'
import {
    Box,
    Button,
    LayersIcon,
    HelpIcon,
    PowerIcon,
    StyledBoltIcon,
} from './index.style'

type Props = {
    enable: boolean
    onClickCover?: () => void
    onClickEnable?: () => void
}

export function CoverOrEnable({ enable, onClickCover, onClickEnable }: Props) {
    return (
        <Box>
            {enable ? (
                <Button
                    key="cover"
                    onClick={onClickCover}
                    title=""
                >
                    <LayersIcon fontSize="small" />
                    <span>打开专注蒙层</span>
                    {/* <HelpIcon fontSize="small" /> */}
                </Button>
            ) : (
                <Button
                    key="on"
                    onClick={onClickEnable}
                    title="点击启用查词翻译服务"
                >
                    <PowerIcon fontSize="small" />
                    <span>请点此处启用</span>
                    <StyledBoltIcon fontSize="small" />
                </Button>
            )}
        </Box>
    )
}
