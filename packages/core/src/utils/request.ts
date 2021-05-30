//

export async function lookUpApi(word: string) {
    const apiUrl = process.env.LOOKUP_API
    const url = `${apiUrl}?w=${word.toLowerCase()}`

    return fetch(url, {}).then(
        (response) => {
            return response.json()
        },
        (reason) => {
            return reason
        }
    )
}
