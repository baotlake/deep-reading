import React, { useEffect, useRef, useState, RefObject } from 'react'
import { createPortal } from 'react-dom'


function Shadow({ root, children }: {
    root: Element | undefined
    children: JSX.Element
}) {
    if (!root) return <></>
    return createPortal(children, root)
}


export default function ShadowHost({ hostEl, children }: {
    hostEl: RefObject<HTMLDivElement>
    children: JSX.Element
}) {

    useEffect(() => {
        const root = hostEl.current?.attachShadow({ mode: "open" })
        setRoot(root as unknown as Element)
    }, [])

    const [root, setRoot] = useState<Element>()

    return (
        <Shadow root={root}>
            {children}
        </Shadow>
    )
}