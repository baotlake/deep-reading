import React, { useRef, useState } from "react"
import { useRouter } from "next/router"
import classNames from "classnames"
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded'
import SvgIcon from '@mui/material/SvgIcon'
import CleanSvg from '../../assets/svg/clean.svg?svgr'
import {
    Container,
    Bar,
    ScannerButton,
    Input,
    ClearButton,
    GoButton,
    InputLabel,
} from './GoBar.style'

const urlPattern = /^https?:\/\/\S+/
const urlLoosePattern = /^(\w+\.){1,2}[a-z]{2,6}/

export default function GoBar() {

    const [input, setInput] = useState('')
    const [focus, setFocus] = useState(false)
    const [invalid, setInvalid] = useState(false)
    const inputEl = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        console.log('keyup: ', e)
        switch (e.key) {
            case 'Escape':
                setFocus(false)
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

    const unwrapUrl = (text: string) => {
        if (urlPattern.test(text)) {
            const url = new URL(text)
            const key = url.searchParams.get('r')
            const queryUrl = key && url.searchParams.get(key)
            if (key && queryUrl && urlPattern.test(queryUrl)) {
                return queryUrl
            }
        }
        return text
    }

    const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const text = e.clipboardData.getData('text/plain')
        setInput(unwrapUrl(text))
        // let copiedRichText = e.clipboardData.getData('text/html')
        // if (!copiedRichText || copiedRichText.length <= copiedText.length) {
        //     setInput(copiedText)
        // } else {
        //     // 如果粘贴的不是url, 则尝试获取富文本
        //     setInput(copiedRichText)
        // }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value
        setInput(unwrapUrl(text))
        invalid && setInvalid(false)
    }

    const go = () => {
        if (urlPattern.test(input)) {
            return router.push('/reading?url=' + encodeURIComponent(input))
        }
        if (urlLoosePattern.test(input)) {
            return router.push('/reading?url=' + encodeURIComponent(`https://${input}`))
        }

        setInvalid(true)
    }

    const handleClickScanner = () => {
        router.push('/start/qr#keep')
    }

    const handleFocus = () => {
        setFocus(true)
        window?.Tawk_API?.hideWidget && window.Tawk_API.hideWidget()
    }

    return (
        <Container
            className={classNames({
                invalid: invalid,
            })}
        >
            {
                invalid && (<InputLabel htmlFor="go-input">
                    请输入网址/链接
                </InputLabel>)
            }
            <Bar
                className={classNames({
                    focus: focus,
                    invalid: invalid,
                })}
            >

                <ScannerButton
                    onClick={handleClickScanner}
                >
                    <QrCodeScannerIcon fontSize="small" />
                </ScannerButton>

                <Input
                    ref={inputEl}
                    id="go-input"
                    name="go-input"
                    inputMode="url"
                    autoComplete="off"
                    contentEditable="true"
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onSubmit={go}
                    onFocus={handleFocus}
                    onBlur={() => setFocus(false)}
                    type="text"
                    placeholder="输入网址/链接"
                    value={input}
                />
                {input && (
                    <ClearButton onClick={clear}>
                        <SvgIcon component={CleanSvg} inheritViewBox fontSize="small" />
                    </ClearButton>
                )}
                <GoButton onClick={go}>
                    <ArrowCircleRightRoundedIcon />
                </GoButton>

            </Bar>
        </Container>
    )
}
