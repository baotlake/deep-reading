import {render, createPortal} from 'react-dom'
import {useEffect, useRef, useState} from 'react'
import App from './App'


function getContainer(): Element {
    let root = document.querySelector('#deep-reading-root')
    if (root === null) {
        root = document.createElement('div')
        root.id = 'deep-reading-root'
        document.body.appendChild(root)
    }
    return root
}

const target = getContainer()

function ShadowContent({children, root}: { children: React.ReactNode, root: Element }) {
    return createPortal(children, root)
}

function Root() {
    const parentRef = useRef<HTMLDivElement>(null)
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot>()

    useEffect(() => {
        if (parentRef.current) {
            let shadowRoot = parentRef.current.attachShadow({mode: 'open'})
            // createPortal(props.children, shadowRootRef.current as unknown as Element)
            setShadowRoot(shadowRoot)
        }
    }, [])

    return (
        <div ref={parentRef} wrp-action={"no-look-up"}>
            { shadowRoot && <ShadowContent root={shadowRoot as unknown as Element}>
                <App/>
            </ShadowContent>}
        </div>
    )
}

render(<Root />, target)
