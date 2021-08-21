import { useState, MouseEvent } from 'react'

import { Explanation, Point, Translation } from '@wrp/ui'

export default function WrpUI() {
    let [position, setPosition] = useState<[number, number]>([90, 90])
    let [visible, setVisible] = useState(false)

    let [trVisible, setTrVisible] = useState(false)

    const handleClick = (e: MouseEvent) => {
        setPosition([e.clientX, e.clientY])
        setVisible(true)
        setTrVisible(true)
    }

    return (
        <div>
            <div
                onClick={handleClick}
                style={{
                    width: '100%',
                    height: '100vh',
                }}
            >
                <h1>Experiment UI</h1>
                <p>xxx</p>
            </div>

            <Explanation
                visible={visible}
                position={position}
                zoom={1}
                data={{
                    word: 'Experiment',
                }}
                onClose={() => setVisible(false)}
            />

            <Point position={position} size={6} />

            <Translation
                visible={trVisible}
                data={{}}
                onClose={() => {
                    console.log('set tr visible false')
                    setTrVisible(false)
                }}
            />
        </div>
    )
}
