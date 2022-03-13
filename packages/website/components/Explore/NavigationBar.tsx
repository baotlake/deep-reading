import classNames from 'classnames'
import React, { useRef } from 'react'

import { Wrapper, Container, Item } from './NavigationBar.style'

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
            <Wrapper
                onWheel={wheel}
                ref={scrollView}
            >
                <Container>
                    {props.list.map((item, index) => (
                        <Item
                            id={item.key}
                            className={classNames({
                                selected: props.selected === index
                            })}
                            onClick={() => props.setIndex(index)}
                            key={item.key}
                        >
                            {item.title}
                        </Item>
                    ))}
                </Container>
            </Wrapper>
        </>
    )
}
