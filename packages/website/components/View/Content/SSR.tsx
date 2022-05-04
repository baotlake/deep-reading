import { useState } from "react"

export function SSR() {

    const [count, setCount] = useState(0)

    return (
        <div>
            <div>{count}</div>
            <button
                onClick={() => setCount(count + 1)}
            >+</button>
        </div>
    )
}

