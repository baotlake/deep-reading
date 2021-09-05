import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {create, Jss} from "jss";
import {jssPreset, StylesProvider} from "@material-ui/core/styles";

export default function Styles(props: PropsWithChildren<{}>) {
    const stylesParentRef = useRef<HTMLDivElement>(null)
    const [jss, setJss] = useState<Jss>()

    useEffect(() => {
        if (stylesParentRef.current) {
            const jss = create({
                ...jssPreset(),
                insertionPoint: stylesParentRef.current
            })
            setJss(jss)
        }
    }, [])

    return (
        <>
            <div className={"styles-point"} ref={stylesParentRef}/>
            {jss && <StylesProvider jss={jss}>
                {props.children}
            </StylesProvider>}
        </>
    )
}
