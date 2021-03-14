import React, { useRef } from 'react'

export default function NavigationBar(props: {
    selected: number,
    list: any[]
    setIndex: (index: number) => void
}) {

    const scrollView = useRef(null as unknown as HTMLDivElement);

    const wheel = (e: React.WheelEvent<HTMLDivElement>) => {
        scrollView.current.scroll({
            left: scrollView.current.scrollLeft + e.deltaY,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <div
                className="wrp-navigation-bar-wrapper"
                onWheel={wheel}
                ref={scrollView}
            >
                <ul className="wrp-navigation-bar-container">
                    {
                        props.list.map((item, index) => (
                            <li
                                className={`wrp-navigation-bar-item ${props.selected === index
                                    ? 'wrp-navigation-selected' : ''}`}
                                onClick={() => props.setIndex(index)}
                                key={item.key}
                            >
                                {item.title}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}