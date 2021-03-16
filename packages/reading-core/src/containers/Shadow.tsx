import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'


function Shadow({ root, children }: {
    root: ShadowRoot
    children: JSX.Element
}) {
    if (!root) return <></>
    return createPortal(children, root as unknown as Element)
}


export default function ShadowHost({ hostEl, children }: {
    hostEl: React.MutableRefObject<HTMLElement>
    children: JSX.Element
}) {

    useEffect(() => {
        const root = hostEl.current.attachShadow({ mode: "open" })
        setRoot(root)
    }, [])

    const [root, setRoot] = useState(null as unknown as ShadowRoot)

    return (
        <Shadow root={root}>
            {children}
        </Shadow>
    )
}