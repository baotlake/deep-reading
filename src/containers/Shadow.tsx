import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'


function Shadow({ root, children }: {
    root: ShadowRoot
    children: JSX.Element
}) {
    // if (!root) return <></>
    // @ts-ignore
    return createPortal(children, root)
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

    if (!root) return children

    return (
        <Shadow root={root}>
            {children}
        </Shadow>
    )
}