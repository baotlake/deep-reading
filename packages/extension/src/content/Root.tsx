import {createPortal, render} from 'react-dom'
import {useEffect, useRef, useState} from 'react'
import App from './App'
import Styles from './Styles'
import {Jss} from 'jss'
import {jssPreset, StylesProvider} from "@material-ui/core/styles";

function Portal({children, root}: { children: React.ReactNode, root: Element }) {
    return createPortal(children, root)
}

export default function Root({root, jss}: { root: HTMLElement, jss: Jss }) {
    return (
        <StylesProvider jss={jss}>
            <Portal root={root}>
                <App/>
            </Portal>
        </StylesProvider>
    )
}



