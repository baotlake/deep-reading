import { useState, useRef, ChangeEvent, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReadingHistory, ReadingHistoryItem } from '@wrp/core'

import style from './home.module.scss'
import { ItemCard } from '../../components/Home'

export default function Home() {
    const router = useRouter()
    const [focused, setFocused] = useState(false)
    const [input, setInput] = useState('')
    const inputEl = useRef<HTMLInputElement>(null)
    const [historyList, setHistoryList] = useState<
        Partial<ReadingHistoryItem>[]
    >([])

    useEffect(() => {
        const history = new ReadingHistory()
        history.get(50).then((list) => {
            console.log('list', list)
            setHistoryList(list)
        })
    }, [])

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
        router.push('/reading?url=' + encodeURIComponent(input))
    }

    return (
        <div className="wrp-page">
            <div className={style['wrp-app-logo-container']}>
                <div className={style['wrp-app-logo']}>
                    <Image
                        src="/logo.png"
                        layout="fill"
                        alt="Logo"
                    />
                </div>

                <h1
                    className={style['wrp-app-logo-title']}
                    style={{ display: 'none' }}
                >
                    Word Reading Beta
                </h1>
            </div>
            <div
                className={`${style['wrp-input-container']} ${
                    focused ? style['focused'] : ''
                }`}
            >
                <div className={style['wrp-input-bar']}>
                    {focused ? (
                        <div
                            className={style['wrp-input-bar-button']}
                            onClick={() => setFocused(false)}
                        >
                            <svg
                                viewBox="0 0 1118 1024"
                                version="1.1"
                                width="218.359375"
                                height="200"
                                fill="var(--c-dark)"
                            >
                                <defs>
                                    <style type="text/css"></style>
                                </defs>
                                <path
                                    d="M229.42 558.545h841.125c25.707 0 46.546-20.839 46.546-46.545 0-25.706-20.84-46.545-46.546-46.545H229.42L544.913 149.96c18.177-18.177 18.177-47.648 0-65.825-18.178-18.177-47.648-18.177-65.826 0L84.137 479.087c-9.09 9.089-13.634 21.001-13.634 32.913 0 11.912 4.545 23.824 13.633 32.913l394.951 394.95c18.178 18.178 47.648 18.178 65.826 0 18.177-18.176 18.177-47.647 0-65.824L229.419 558.545z"
                                    p-id="5564"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        ''
                    )}
                    {/* <input type="file"></input> */}
                    <input
                        ref={inputEl}
                        className={`${style['wrp-input']} ${
                            focused ? style['wrp-input-focused'] : ''
                        }`}
                        id="wrp-home-input"
                        autoComplete="off"
                        contentEditable="true"
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        onPaste={handlePaste}
                        onFocus={() => setFocused(true)}
                        type="text"
                        placeholder="贴入文章或链接"
                        value={input}
                    ></input>
                    {focused ? (
                        <div
                            className={`${style['wrp-input-bar-button']} ${style['wb-clearinput']}`}
                            onClick={clearInput}
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                width="200"
                                height="200"
                                fill="var(--c-dark)"
                            >
                                <defs>
                                    <style type="text/css"></style>
                                </defs>
                                <path
                                    d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z m241.005714 703.268571a32.182857 32.182857 0 0 1 0.512 45.348572 32.182857 32.182857 0 0 1-45.348571 0.512L512 556.763429 315.830857 748.982857a31.963429 31.963429 0 1 1-44.836571-45.787428L466.285714 512l-195.291428-191.268571a32.182857 32.182857 0 0 1-0.512-45.348572 32.182857 32.182857 0 0 1 45.348571-0.512L512 467.236571 708.169143 275.017143a31.963429 31.963429 0 1 1 44.836571 45.787428L557.714286 512l195.291428 191.268571z"
                                    p-id="10064"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        ''
                    )}
                    <div className={style['wrp-input-bar-go']} onClick={go}>
                        <svg viewBox="0 0 218.36 200">
                            <path
                                fill="var(--c-light)"
                                d="M187.14,109.09l-61.62,61.62a9.09,9.09,0,0,0,12.86,12.86l77.14-77.14a9.1,9.1,0,0,0,0-12.86L138.38,16.43a9.09,9.09,0,1,0-12.86,12.86l61.62,61.62H22.86a9.09,9.09,0,1,0,0,18.18Z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className={style['wrp-card-container']}>
                {historyList.map((item, index) => (
                    <ItemCard key={index} data={item} />
                ))}
            </div>
            <div>{/**推荐文章 */}</div>
        </div>
    )
}
