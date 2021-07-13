import React, { useRef } from 'react'

import style from './navigationBar.module.scss'

export default function NavigationBar(props: {
    selected: number
    list: any[]
    setIndex: (index: number) => void
}) {
    const scrollView = useRef((null as unknown) as HTMLDivElement)

    const wheel = (e: React.WheelEvent<HTMLDivElement>) => {
        scrollView.current.scroll({
            left: scrollView.current.scrollLeft + e.deltaY,
            behavior: 'smooth',
        })
    }

    return (
        <>
            <div
                className={style['wrp-navigation-bar-wrapper']}
                onWheel={wheel}
                ref={scrollView}
            >
                <ul className={style['wrp-navigation-bar-container']}>
                    {props.list.map((item, index) => (
                        <li
                            id={item.key}
                            className={`${style['wrp-navigation-bar-item']} ${
                                props.selected === index
                                    ? style['wrp-navigation-selected']
                                    : ''
                            }`}
                            onClick={() => props.setIndex(index)}
                            key={item.key}
                        >
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
