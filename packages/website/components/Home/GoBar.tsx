import { useRef, useState } from "react"
import { useRouter } from "next/router"
import { ClearIcon } from "./Svg"
import classNames from "classnames"
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded'

import {
    Container,
    Bar,
    ScannerButton,
    Input,
    ClearButton,
    GoButton,
    InputLabel,
} from './GoBar.style'


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
        router.push('/start/qr#keep')
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
                    onChange={(e) => {
                        setInput(e.currentTarget.value)
                        invalid && setInvalid(false)
                    }}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onSubmit={go}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    type="text"
                    placeholder="输入网址/链接"
                    value={input}
                />
                {input && (
                    <ClearButton onClick={clear}>
                        <ClearIcon />
                    </ClearButton>
                )}
                <GoButton onClick={go}>
                    <ArrowCircleRightRoundedIcon />
                </GoButton>

            </Bar>
        </Container>
    )
}
