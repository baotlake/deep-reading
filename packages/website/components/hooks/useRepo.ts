import { useEffect, useState } from "react"


type Repo = {
    stargazers_count?: number
}

export function useRepo() {
    const [repo, setRepo] = useState<Repo>({})

    useEffect(() => {
        fetch('https://api.github.com/repos/baotlake/deep-reading')
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setRepo(data)
            })
    }, [])

    return repo
}