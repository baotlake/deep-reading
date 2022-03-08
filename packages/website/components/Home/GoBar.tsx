import { useRef, useState } from "react"
import { useRouter } from "next/router"
import { ClearIcon } from "./Svg"
import classNames from "classnames"
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { ButtonBase } from "@mui/material"
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded'

import style from './goBar.module.scss'


export default function GoBar() {

    const [input, setInput] = useState('')
    const [focused, setFocused] = useState(false)
    const [invalid, setInvalid] = useState(false)
    const inputEl = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        console.log('keyup: ', e)

        switch (e.key) {
            case 'Escape':
                setFocused(false)
                inputEl.current?.blur()
                break
            case 'Enter':
                go()
                break
        }
    }

    const clear = () => {
        setInput('')
        inputEl.current?.focus()
    }

    const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()

        let copiedText = e.clipboardData.getData('text/plain')
        setInput(copiedText)
        // let copiedRichText = e.clipboardData.getData('text/html')
        // if (!copiedRichText || copiedRichText.length <= copiedText.length) {
        //     setInput(copiedText)
        // } else {
        //     // 如果粘贴的不是url, 则尝试获取富文本
        //     setInput(copiedRichText)
        // }
    }

    const go = () => {
        if (/^https?:\/\//.test(input)) {
            return router.push('/reading?url=' + encodeURIComponent(input))
        }
        if (/(\w+\.){1,2}((net)|(com)|(cn)|(hk)|(us)|(uk)|(app)|(org)|(edu)|(gov)|(dev))$/.test(input)) {
            return router.push('/reading?url=' + encodeURIComponent(`https://${input}`))
        }

        setInvalid(true)
    }

    const handleClickScanner = () => {
        router.push('/start/qr')
    }

    return (
        <div
            className={style['input-container']}
        >
            <div className={classNames(style['input-bar'], {
                [style['focused']]: focused,
                [style['invalid']]: invalid,
            })}>

                <ButtonBase
                    className={style['scanner-button']}
                    onClick={handleClickScanner}
                >
                    <QrCodeScannerIcon fontSize="small" />
                </ButtonBase>

                <input
                    ref={inputEl}
                    id="go-input"
                    name="go-input"
                    inputMode="url"
                    autoComplete="off"
                    contentEditable="true"
                    onChange={(e) => {
                        setInput(e.currentTarget.value)
                        invalid && setInvalid(false)
                    }}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onSubmit={go}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    type="text"
                    placeholder="输入网址/链接"
                    value={input}
                ></input>
                {input && (
                    <label
                        className={classNames(style['clear-button'])}
                        htmlFor="go-input"
                        onClick={clear}
                    >
                        <ClearIcon />
                    </label>
                )}
                <div className={style['go-button']} onClick={go}>
                    <ArrowCircleRightRoundedIcon />
                </div>
                {
                    invalid && (
                        <label
                            className={style['error']}
                            htmlFor="go-input"
                        >
                            请输入网址/链接
                        </label>
                    )
                }
            </div>
        </div>
    )
}
