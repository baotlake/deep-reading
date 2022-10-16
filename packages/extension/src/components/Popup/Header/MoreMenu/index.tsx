import { useState } from 'react'
import { ClickAwayListener } from '@mui/material'
import { sendMessage } from '../../../../uitls/extension'
import { ExtMessageData } from '../../../../types'

import { Button, MoreIcon } from '../index.style'
import { Box, Menu, MenuItem } from './index.style'

export function MoreMenu() {
    // 'string' value mean freezed value
    const [visibleAt, setVisibleAt] = useState<number | string>(0)

    const show = () => {
        const now = Date.now()
        setVisibleAt(typeof visibleAt === 'string' ? now + '' : now)
    }

    const delayClose = () => {
        const delay = 350
        setTimeout(() => {
            setVisibleAt((v) =>
                typeof v === 'number' && Date.now() - v >= delay ? 0 : v
            )
        }, delay)
    }

    const handleClickMenu = () => {
        const isClose = typeof visibleAt === 'string' && parseInt(visibleAt) > 1
        setVisibleAt(isClose ? 0 : Date.now() + '')
    }

    const handleClickAway = () => {
        setVisibleAt(0)
    }

    const openPage = (url: string) => {
        sendMessage<ExtMessageData>({
            type: 'openPage',
            payload: {
                url,
            }
        })
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
                <Button
                    onPointerEnter={show}
                    onPointerLeave={delayClose}
                    onClick={handleClickMenu}
                    title="菜单按钮"
                >
                    <MoreIcon />
                </Button>
                {visibleAt > 1 && (
                    <Menu
                        onPointerEnter={show}
                        onPointerLeave={delayClose}
                        onClick={() => setVisibleAt(0)}
                    >
                        <MenuItem
                            onClick={() => openPage('options.html')}
                        >
                            选项
                        </MenuItem>
                        <MenuItem
                            onClick={() => openPage('options.html')}
                        >
                            帮助
                        </MenuItem>
                        <MenuItem
                            onClick={() => openPage('options.html')}
                        >
                            关于
                        </MenuItem>
                    </Menu>
                )}
            </Box>
        </ClickAwayListener>
    )
}
