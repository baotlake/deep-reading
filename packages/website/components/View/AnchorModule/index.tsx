import {useEffect} from 'react'
import {navigateIcon, bookIcon, openIcon} from './icons'
import classNames from "classnames"
import Link from 'next/link'
import {Button} from '@mui/material'

import styles from './index.module.scss'

interface Props {
    visible: boolean
    href: string
    onClose?: () => void
}

export default function AnchorModal({visible, href, onClose}: Props) {
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (typeof onClose === 'function') onClose()
            }, 3000)
        }
    }, [visible])

    return (
        <div
            className={
                classNames(styles['anchor-module'], {
                    [styles['visible']]: visible
                })
            }
            data-wrp-action-block="intercept"
        >
            {/^#.+/.test(href) ? (
                <a href={href}>
                    <Button className={styles['button']}>
                        {navigateIcon}
                        <div className={styles['title']}>转跳至此处</div>
                    </Button>
                </a>
            ) : (
                <Link href={`/reading?url=${encodeURIComponent(href)}`}>
                    <Button className={styles['button']}>
                        {bookIcon}
                        <div className={styles['title']}>阅读新页面</div>
                    </Button>
                </Link>
            )}

            <Button className={styles['button']} onClick={() => {
                open(href, '_blank')
            }}>
                {openIcon}
                <div className={styles['title']}>新窗口打开</div>
            </Button>
        </div>
    );
}
