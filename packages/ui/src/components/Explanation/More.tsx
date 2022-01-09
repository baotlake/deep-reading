import React from 'react'

export default function More(props: {
    list: string[]
    collapsed: boolean
    loadWordData: (word: string) => void
    setCollapsed: (value: boolean) => void
}) {
    // const renderMore = (moreList, unfold) => {
    let Childs = []
    if (!Array.isArray(props.list)) return <></>
    if (!props.collapsed) {
        // Expanded state
        Childs = props.list.map((word) => {
            return <span onClick={() => props.loadWordData(word)}>{word}</span>
        })
        Childs.push(
            <span
                className="unfold-button"
                onClick={() => props.setCollapsed(false)}
            >{`<`}</span>
        )
    } else {
        // Folded state
        if (props.list.length >= 1) {
            Childs.push(
                <span onClick={() => props.loadWordData(props.list[0])}>
                    {props.list[0]}
                </span>
            )
        }
        if (props.list.length > 1) {
            Childs.push(
                <span
                    className="unfold-button"
                    onClick={() => props.setCollapsed(false)}
                >{`<`}</span>
            )
        }
    }
    return <>{Childs}</>
}
