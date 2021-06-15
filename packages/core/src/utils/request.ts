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

export async function translateApi(bodyData: URLSearchParams) {
    const apiUrl = process.env.TRANSLATE_API
    const url = apiUrl

    return fetch(url, {
        method: 'POST',
        body: bodyData,
    }).then(
        (response) => {
            return response.json()
        },
        (reason) => {
            return reason
        }
    )
}

async function proxyApi(href: string) {
    const apiUrl = process.env.PROXY_API
    const url = `${apiUrl}?url=${href}`

    return fetch(url, {}).then(
        (response) => {
            return response.json()
        },
        (reason) => {
            return reason
        }
    )
}
