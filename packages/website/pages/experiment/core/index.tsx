import {
    MouseEventHandler,
    useEffect,
    useRef,
    KeyboardEventHandler,
    UIEventHandler,
} from 'react'

import {
    getTargetByPoint,
    extractSentenceRange,
    extractWordRange,
} from '@wrp/core'

import html from './typescript.com_html'

export default function Ext() {
    const data = useRef<{ x: number; y: number; range?: Range }>({
        x: 0,
        y: 0,
    })
    const divEl = useRef<HTMLDivElement>(null)

    const handleClick: MouseEventHandler = (e) => {
        let [x, y] = [e.clientX, e.clientY]
        console.log('e: ', e)
        console.log('target: ', e.target)
        console.log('x, y', e.clientX, e.clientY)

        let target = getTargetByPoint(x, y)

        if (target) {
            console.log('%c getTargetByPoint ', 'color:red;',
                `【${target[0]?.textContent?.slice(target[1], target[1] + 1)}】`,
                target[0],
            )

            // let wordRange = extractWordRange(...target)
            // data.current.range = wordRange
            // console.log(`%cword 「${wordRange.toString()}」`, 'color: red;')

            let sentenceRange = extractSentenceRange(...target)
            const selection = window.getSelection()
            if (selection) {
                selection.removeAllRanges()
                selection.addRange(sentenceRange)
            }
        }

        handleScroll()
    }

    const handleMouseMove: MouseEventHandler = (e) => {
        if (!e.metaKey) {
            return
        }
        data.current.x = e.clientX
        let x = e.clientX
        data.current.y = e.clientY
        let y = e.clientY

        let target = getTargetByPoint(x, y)

        if (target) {
            // let wordRange = extractWordRange(
            //     ...target
            // )
            // data.current.range = wordRange
            // handleScroll()

            let sentenceRange = extractSentenceRange(...target)
            const selection = window.getSelection()
            if (selection) {
                selection.removeAllRanges()
                selection.addRange(sentenceRange)
            }
        }

    }

    const handleScroll = (e?: React.UIEvent<Element>) => {
        if (data.current.range && divEl.current) {
            let position = data.current.range.getBoundingClientRect()
            divEl.current.style.top = position.top + 'px'
            divEl.current.style.left = position.left + 'px'
            divEl.current.style.width = position.right - position.left + 'px'
            divEl.current.style.height = position.bottom - position.top + 'px'
        }
    }

    return (
        <div
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            style={{
                height: '100vh',
                overflowY: 'auto',
                position: 'relative',
            }}
            onScroll={handleScroll}
        >
            <h1 style={{fontSize: 60}}>Ext Experiment</h1>
            <section >
                <div dangerouslySetInnerHTML={{__html: html}}/>
            </section>

            <div
                ref={divEl}
                style={{
                    position: 'fixed',
                    background: 'rgba(255, 200, 200, 0.6)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    )
}
