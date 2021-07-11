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

export type ServerPoint = 'shanghai' | 'tokyo'

export async function proxyApi(href: string, point?: ServerPoint) {
    let apiUrl = process.env.SHANGHAI_PROXY_API
    switch (point) {
        case 'shanghai':
            apiUrl = process.env.SHANGHAI_PROXY_API
            break
        case 'tokyo':
            apiUrl = process.env.TOKYO_PROXY_API
            break
        default:
            apiUrl = process.env.SHANGHAI_PROXY_API
    }

    const url = `${apiUrl}?url=${encodeURIComponent(href)}`
    console.log('proxyApi: url ', url)
    return fetch(url, {})
    // return fetch(url, {}).then(
    //     (response) => {
    //         return response.text()
    //     },
    //     (reason) => {
    //         return reason
    //     }
    // )
}
