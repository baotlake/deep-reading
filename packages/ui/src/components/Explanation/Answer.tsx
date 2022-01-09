import React from 'react'
export default function Answer({ answer }: { answer: string[][] }) {
    if (!answer) return <></>
    return (
        <>
            {answer.map((item, index) => (
                <dt key={index}>
                    <b>{item[0]}</b>
                    {item[1]}
                </dt>
            ))}
        </>
    )
}
