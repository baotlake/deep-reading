import {ChangeEvent, useRef, useState} from "react"
import {useRouter} from "next/router"
import style from './goBar.module.scss'
import {ClearIcon, LeftArrow, RightArrow} from "./Svg"

export default function GoBar() {

    const [focused, setFocused] = useState(false)
    const inputEl = useRef<HTMLInputElement>(null)
    const [input, setInput] = useState('')
    const router = useRouter()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        // console.log('onChange');
        setInput(e.currentTarget.value)
    }
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

    const clearInput = () => {
        setInput('')
        inputEl.current?.focus()
    }

    const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()

        let copiedText = e.clipboardData.getData('text/plain')
        let copiedRichText = e.clipboardData.getData('text/html')
        if (!copiedRichText || copiedRichText.length <= copiedText.length) {
            setInput(copiedText)
        } else {
            // 如果粘贴的不是url, 则尝试获取富文本
            setInput(copiedRichText)
        }
    }

    const go = () => {
        if (/^https?:\/\/\w+\.\w+/.test(input)) {
            router.push('/reading?url=' + encodeURIComponent(input))
        }
        if (/(\w+\.){1,2}((net)|(com)|(cn)|(hk)|(us)|(uk)|(app)|(org)|(edu)|(gov)|(dev))$/.test(input)) {
            router.push('/reading?url=' + encodeURIComponent(`https://${input}`))
        }
    }

    return (
        <div
            className={`${style['input-container']}`}
        >
            <div className={style['input-bar']}>
                {focused && (
                    <div
                        className={style['button']}
                        onClick={() => setFocused(false)}
                    >
                        <LeftArrow/>
                    </div>
                )}
                <input
                    ref={inputEl}
                    className={focused ? style['focused'] : ''}
                    autoComplete="off"
                    contentEditable="true"
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    type="text"
                    placeholder="输入网址"
                    value={input}
                ></input>
                {focused && (
                    <div
                        className={`${style['button']} ${style['clear-button']}`}
                        onClick={clearInput}
                    >
                        <ClearIcon/>
                    </div>
                )}
                <div className={style['go-button']} onClick={go}>
                    <RightArrow/>
                </div>
            </div>
        </div>
    )
}
