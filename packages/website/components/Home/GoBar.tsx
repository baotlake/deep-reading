import { ChangeEvent, useRef, useState } from "react"
import { useRouter } from "next/router"
import { ClearIcon, LeftArrow, RightArrow } from "./Svg"
import QRScanner from "./QRScanner"
import classNames from "classnames"
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { ButtonBase } from "@mui/material"

import style from './goBar.module.scss'


export default function GoBar() {

    const [input, setInput] = useState('')
    const [focused, setFocused] = useState(false)
    const [scannerVisible, setScannerVisible] = useState(false)
    const inputEl = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        console.log('keyup: ', e)
        if (e.code === 'Escape') {
            setFocused(false)
            inputEl.current?.blur()
        }
        if (e.code === 'Enter') {
            go()
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
            router.push('/reading?url=' + encodeURIComponent(input))
        }
        if (/(\w+\.){1,2}((net)|(com)|(cn)|(hk)|(us)|(uk)|(app)|(org)|(edu)|(gov)|(dev))$/.test(input)) {
            router.push('/reading?url=' + encodeURIComponent(`https://${input}`))
        }
    }

    const handleScanerResult = (text: string) => {
        const isUrl = /^https?:\/\//.test(text)
        if (isUrl) {
            router.push('/reading?url=' + encodeURIComponent(text))
            setScannerVisible(false)
        } else {
            // 
        }
    }

    return (
        <div
            className={style['input-container']}
        >
            <div className={style['input-bar']}>

                <ButtonBase
                    className={style['scanner-button']}
                    onClick={() => setScannerVisible(true)}
                >
                    <QrCodeScannerIcon fontSize="small" />
                </ButtonBase>

                <input
                    ref={inputEl}
                    className={focused ? style['focused'] : ''}
                    id="go-input"
                    name="go-input"
                    inputMode="url"
                    autoComplete="off"
                    contentEditable="true"
                    onChange={(e) => setInput(e.currentTarget.value)}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onSubmit={go}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    type="text"
                    placeholder="输入网址"
                    value={input}
                ></input>
                {input && (
                    <label
                        className={classNames(style['button'], style['clear-button'])}
                        htmlFor="go-input"
                        onClick={clear}
                    >
                        <ClearIcon />
                    </label>
                )}
                <div className={style['go-button']} onClick={go}>
                    <RightArrow />
                </div>
            </div>
            {
                scannerVisible && <QRScanner
                    onResult={handleScanerResult}
                    onClose={() => setScannerVisible(false)}
                />
            }

        </div>
    )
}
